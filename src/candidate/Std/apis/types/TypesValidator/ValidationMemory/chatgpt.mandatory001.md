Creo que el nudo que tienes aquí es que estás intentando resolver dos problemas distintos con una misma operación: **la resolución recursiva de los imports y la validación del AST resultante**. Y, por cómo tienes organizado `TypesValidator`, yo no convertiría `innerValidate` en asíncrono.

Me quedaría con tu intuición inicial: **resolver los imports antes de entrar en la validación propiamente dicha, pero hacerlo mediante una fase de resolución recursiva asíncrona, no mediante un reemplazo textual ni mediante una pasada superficial por el AST.**

Hay un matiz importante: no necesitas resolver los imports en dos pasadas completas. Puedes hacer una única operación recursiva que lea, parsee y resuelva cada import, y que devuelva el AST con los imports sustituidos por sus respectivos AST materializados.

Vamos por partes, porque aquí la ubicación de esa «grieta» que mencionas es fundamental.

## 1. Qué tienes actualmente y qué quieres conseguir

Tu gramática ya reconoce los imports:

```pegjs
Type_import = "^" resource:("file:"/"url:"/"path:")? target:json_string
  { return { grammar: "import", resource, target } }
```

Por tanto, una expresión como:

```tyla
@file1 ^file:"./some.tyla";
```

produce un nodo de este estilo:

```js
{
  grammar: "import",
  resource: "file:",
  target: "./some.tyla"
}
```

Y tu `TypesValidator` tiene un flujo síncrono en `_innerValidate`, que despacha según `localAst.grammar`. Actualmente, entre los casos contemplados, no está `import`. La gramática lo reconoce, pero la validación todavía no sabe qué hacer con él. 

Sin embargo, observa algo importante: **un import no es realmente un tipo que debas validar contra los datos; es una instrucción para construir el AST que sí quieres validar.**

Por ejemplo, imagina que `some.tyla` contiene:

```tyla
@title string;
{
  title: @title
}
```

Y tu archivo original contiene:

```tyla
@resource1 ^"./some.tyla";
```

Lo que quieres no es que el validador intente validar un nodo `import`. Quieres que, antes de validar, ese nodo desaparezca y en su lugar aparezca el AST correspondiente al contenido importado, con sus propios imports ya resueltos.

Eso cambia dónde debemos colocar la lógica.

## 2. La solución que elegiría: una fase asíncrona antes de `_innerValidate`

Yo mantendría esta separación:

```text
validateData(expression, data)
        |
        v
1. Obtener el AST
        |
        v
2. Resolver los imports (ASYNC)
        |
        |-- Encontrar un import
        |      |
        |      v
        |   read (ASYNC)
        |      |
        |      v
        |   parse (SYNC)
        |      |
        |      v
        |   Resolver los imports del AST importado (ASYNC)
        |      |
        |      v
        |   Materializar el tipo importado
        |      |
        |      v
        |   Sustituir el nodo import
        |
        v
3. Obtener el AST sin imports pendientes
        |
        v
4. _innerValidate (SYNC)
        |
        v
5. Resultado
```

La ventaja es que mantienes intacta la filosofía de tu validador actual.

Tu `_innerValidate` sigue siendo una función síncrona que recibe un AST preparado y realiza su trabajo. La asincronía queda confinada a la operación que realmente la necesita: la resolución de recursos externos.

Hay una precisión importante: **si una operación necesita resolver imports, esa operación completa será asíncrona, aunque la validación posterior siga siendo síncrona**.

Por tanto, `validateData` podría ser asíncrona sin que `_innerValidate` lo fuera.

De hecho, tus tests ya llaman a `await TypesValidator.validateData(...)`, así que ese cambio encajaría con el uso actual. 

### ¿Por qué no convertir todo en asíncrono?

Imagina que conviertes `_innerValidate` en asíncrono.

Entonces tendrías que revisar las llamadas recursivas de:

* `_validateAndOperation`.
* `_validateOrOperation`.
* `_validateTypeLabel`.
* `_validateIdType`.
* `_innerValidateObject`.
* `_validateScript`.

Y, en general, cualquier función que dependa de los resultados de `_innerValidate`.

Por ejemplo, ahora mismo tienes:

```js
const output = this._innerValidate(submemory);

if (output instanceof Error) {
  return output;
}
```

Si `_innerValidate` pasara a ser asíncrono, necesitarías:

```js
const output = await this._innerValidate(submemory);

if (output instanceof Error) {
  return output;
}
```

Y eso no sería un cambio aislado: tendrías que propagar la asincronía por toda la cadena de llamadas.

Además, `or` tiene una particularidad: prueba alternativas y deja de evaluarlas cuando encuentra una válida. Al introducir asincronía, tendrías que preservar cuidadosamente ese comportamiento.

Todo esto para solucionar una operación que, en realidad, puedes completar antes de empezar a validar.

**Yo no asumiría ese coste. Mantendría síncrono `_innerValidate`.**

---

## 3. La recursividad: dónde está exactamente la grieta

Aquí está el punto que creo que te está haciendo dar vueltas.

Supongamos que tienes estos tres archivos:

**`main.tyla`**

```tyla
@resource ^file:"./types/user.tyla";
```

**`types/user.tyla`**

```tyla
@details ^file:"./details.tyla";
{
  name: string,
  details: @details
}
```

**`types/details.tyla`**

```tyla
{
  city: string,
  age: number
}
```

El resultado que quieres obtener en `main.tyla` es un AST en el que los imports se hayan resuelto y los tipos importados se hayan materializado.

Conceptualmente, el tipo resultante sería:

```tyla
{
  name: string,
  details: {
    city: string,
    age: number
  }
}
```

No necesitas hacer lo siguiente:

1. Leer todos los archivos.
2. Parsear todos los archivos.
3. Volver a recorrer todos los AST para sustituir los imports.

Eso serían pasadas independientes que podrías evitar.

En cambio, puedes resolver cada import antes de devolver el nodo que lo contiene.

### La regla recursiva

La regla es muy sencilla:

**No sustituyas un import por su contenido hasta que hayas terminado de resolver los imports que contiene ese contenido.**

En pseudocódigo:

```js
async function resolveImport(importAst) {
  // 1. Leer el recurso.
  const source = await readImport(importAst);

  // 2. Parsear el contenido.
  const ast = TypesParser.parse(source);

  // 3. Resolver recursivamente sus imports.
  const resolvedAst = await resolveImports(ast);

  // 4. Materializar el resultado del archivo importado.
  return materializeImportedType(resolvedAst);
}
```

Observa dónde está la grieta.

```js
const resolvedAst = await resolveImports(ast);
```

Esa línea es la frontera entre preparar el archivo importado y poder utilizarlo desde el archivo original.

Antes de ella, tienes un AST que todavía podría contener imports.

Después de ella, tienes un AST cuyos imports ya han sido resueltos.

Solo entonces puedes materializar el tipo importado y devolverlo para sustituir el nodo original.

No necesitas que el archivo principal conozca cuántos niveles de importación existen. La recursividad se ocupa de ello.

### Una distinción importante

El pseudocódigo anterior describe el flujo, pero `materializeImportedType` todavía necesita una implementación adecuada en tu proyecto.

Tu `_materializeAst` actual no convierte por sí solo cualquier AST de script en el tipo exportado de ese archivo. Depende de `memory.labels` y de la estructura del AST que recibe. Además, `_validateScript` es quien actualmente obtiene `exportedAst` al procesar la última expresión del script. 

Por tanto, necesitamos distinguir dos operaciones:

* **Resolver imports:** sustituir los nodos `import` por los resultados de los recursos importados, resolviendo sus dependencias.
* **Materializar un tipo:** obtener la expresión de tipos que representa el resultado del archivo, resolviendo las etiquetas que correspondan.

Podemos integrarlas en una misma operación recursiva, pero no debemos confundirlas. En particular, no daría por hecho que basta con llamar a `_materializeAst` sobre el AST recién parseado: antes hay que establecer correctamente el contexto de etiquetas y determinar cuál es la expresión exportada.

---

## 4. Cómo lo organizaría en tu código

Yo empezaría por separar la entrada pública del motor de validación.

Actualmente tienes:

```js
validateData: function (expression, data) {
  const ast = typeof expression === "string" ? Std.classes.TypesParser.parse(expression) : expression;

  return this._innerValidate({
    ast: ast,
    data: data,
  });
},
```

Lo convertiría en una función asíncrona que prepara el AST antes de llamar al validador:

```js
validateData: async function (expression, data) {
  const ast = typeof expression === "string"
    ? Std.classes.TypesParser.parse(expression)
    : expression;

  const resolvedAst = await this._resolveImports(ast);

  return this._innerValidate({
    ast: resolvedAst,
    data: data,
  });
},
```

`_resolveImports` es el nuevo componente que tendrías que implementar.

Este código es el punto de partida arquitectónico; todavía falta definir cómo se materializa el resultado de cada archivo importado y cómo se mantiene el contexto de resolución.

La idea es que `_innerValidate` no tenga que saber de dónde procede un tipo. Tanto si lo has escrito directamente como si procede de uno o de veinte archivos importados, debería recibir un AST preparado.

### ¿Y qué haría `_resolveImports`?

Su responsabilidad sería recorrer el AST completo, sin modificar el original.

Esquemáticamente:

```js
_resolveImports: async function _resolveImports(ast, context) {
  // Si es un valor primitivo, devolverlo.

  // Si es un array, resolver sus elementos.

  // Si es un nodo import:
  //   1. Leer.
  //   2. Parsear.
  //   3. Resolver recursivamente.
  //   4. Obtener el tipo materializado.
  //   5. Devolverlo.

  // Si es un objeto normal:
  //   Resolver recursivamente sus propiedades.
  //   Devolver una copia con los resultados.
},
```

Fíjate en dos decisiones de diseño:

**Primera:** devolvería un AST nuevo en vez de modificar el original. Es coherente con lo que estabas planteándote sobre clonar AST y sustituir ramas sin alterar el árbol de origen.

**Segunda:** introduciría `context` desde el principio, aunque inicialmente sea pequeño. Ahí puedes mantener la información necesaria para resolver rutas relativas, distinguir `file`, `url` y `path`, y detectar importaciones circulares.

Una importación circular, por ejemplo, podría producir esta secuencia:

```text
main.tyla → user.tyla → details.tyla → user.tyla
```

Sin detección de ciclos, la recursividad no terminaría. No necesitas resolver ese caso ahora mismo, pero conviene no diseñar la función de forma que después sea difícil incorporarlo.

---

## 5. Hay una decisión adicional: qué significa materializar un archivo importado

Esta es la única parte que no resolvería a ciegas, porque afecta a la semántica de tu DSL.

En tus tests ya tienes scripts con varias expresiones:

```tyla
@name string;
@age number;
{
  name: @name,
  age: @age
};
```

Tu `_validateScript` trata la última expresión como la exportada y procesa las anteriores para preparar el contexto de etiquetas. 

Por tanto, cuando importas un archivo que contiene un script completo, tienes que respetar esa semántica.

No basta con reemplazar el nodo `import` por el AST del archivo entero: eso introduciría un nodo `script` en una posición donde el validador podría esperar un tipo.

Tampoco basta necesariamente con sustituirlo por la última expresión sin más, porque esta puede depender de etiquetas definidas en las expresiones anteriores.

Yo conservaría la distinción entre estas tres estructuras:

| Estructura               | Responsabilidad                                                  |
| ------------------------ | ---------------------------------------------------------------- |
| AST del script importado | Contiene todas las expresiones del archivo.                      |
| Contexto del script      | Permite resolver las etiquetas y dependencias entre expresiones. |
| AST del tipo exportado   | Contiene el tipo materializado que sustituirá al import.         |

La operación de importación debería devolver el tercero, no simplemente el primero.

Esto también evita que las declaraciones auxiliares de un archivo importado se mezclen accidentalmente con las etiquetas del archivo que lo importa. Habría que definir expresamente el alcance de esas etiquetas, sobre todo si dos archivos utilizan el mismo nombre.

---

## 6. Mi recomendación concreta

Lo organizaría en dos grandes operaciones públicas o internas:

**A. Preparar el AST**

```js
async function prepareAst(ast, context) {
  // Resolver recursos externos.
  // Parsear los archivos importados.
  // Resolver sus imports recursivamente.
  // Materializar sus tipos exportados.
  // Devolver el AST preparado.
}
```

**B. Validar el AST**

```js
function validatePreparedAst(ast, data) {
  return this._innerValidate({
    ast,
    data,
  });
}
```

No tienen por qué llamarse así ni ser métodos independientes. Lo importante es que sus responsabilidades estén separadas.

De este modo, si mañana decides compilar un archivo `.tyla` a un AST reutilizable, podrías aprovechar la primera fase sin tener que validar datos. Y si necesitas validar cien objetos contra el mismo tipo, podrías preparar el AST una vez y reutilizarlo sin repetir las lecturas asíncronas de los imports.

Eso sí, el AST preparado debe ser independiente del estado mutable de una validación concreta, especialmente de `memory.labels`.

### Hay un detalle que sí resolvería antes de escribir el código definitivo

**¿Qué quieres que suceda exactamente cuando un archivo importado contiene varias expresiones?**

Por lo que hace actualmente `_validateScript`, entiendo que quieres importar únicamente el tipo materializado de la última expresión, utilizando las declaraciones anteriores para resolver las etiquetas.

Si esa es la semántica que buscas, podemos construir el resolvedor alrededor de ella sin convertir `_innerValidate` en asíncrono ni reescribir todo tu sistema de validación.
