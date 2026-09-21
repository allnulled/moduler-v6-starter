## NOTA

- Esta conversación fue antes de sopesar otras herramientas.
- Finalmente opté por el que parece el parser más sencillo para parsear error stacks
   - Esta librería lleva 8 años funcionando y sigue teniendo 15 millones de descargas en npm hoy día
   - Tiene una familia de APIs más extensas, pero me parece que los traceos ya no podremos.


## CONVERSACIÓN

Sí. V8 tiene una cosa bastante cómoda: **aunque el `stack` sea texto, la gramática real tiene un conjunto relativamente pequeño de formas**. Lo complicado son algunas esquinas.

Para tu `ErrorDissector`, yo pensaría en V8 como una pequeña gramática, no como una regex.

## 1. Forma base

La forma canónica es:

```text
Error: mensaje
    at función (archivo:línea:columna)
```

Por ejemplo:

```text
Error: Boom
    at foo (/home/carlos/test.js:10:15)
```

El frame sería conceptualmente:

```js
{
  function: "foo",
  location: {
    file: "/home/carlos/test.js",
    line: 10,
    column: 15
  }
}
```

---

## 2. Frame sin función

Puede no existir nombre de función:

```text
    at /home/carlos/test.js:10:15
```

Conceptualmente:

```js
{
  function: null,
  location: {
    file: "/home/carlos/test.js",
    line: 10,
    column: 15
  }
}
```

Esto es importante: **no debes interpretar la ausencia de nombre como un formato extraño**. Es una forma normal de frame.

---

## 3. Función con nombre

```text
    at foo (/home/carlos/test.js:10:15)
```

Nombre:

```text
foo
```

Pero el nombre puede tener prácticamente bastante libertad:

```text
    at Foo.bar (/home/carlos/test.js:10:15)
```

```text
    at Object.foo (/home/carlos/test.js:10:15)
```

```text
    at module.exports.foo (/home/carlos/test.js:10:15)
```

Por eso yo conservaría inicialmente:

```js
function: "Object.foo"
```

en lugar de intentar dividirlo.

---

# 4. `new`

Cuando el frame corresponde a una llamada como constructor:

```text
    at new Foo (/home/carlos/test.js:10:15)
```

Aquí V8 está metiendo información adicional **antes del nombre de función**.

Puedes representarlo:

```js
{
  function: "Foo",
  isConstructor: true,
  file: "/home/carlos/test.js",
  line: 10,
  column: 15
}
```

---

# 5. `async`

Puedes encontrar:

```text
    at async foo (/home/carlos/test.js:10:15)
```

Entonces:

```js
{
  function: "foo",
  isAsync: true,
  file: "/home/carlos/test.js",
  line: 10,
  column: 15
}
```

Y puede combinarse con otras formas.

---

# 6. `async` + método

Por ejemplo:

```text
    at async Foo.bar (/home/carlos/test.js:10:15)
```

La idea sería:

```js
{
  function: "Foo.bar",
  isAsync: true,
  file: "/home/carlos/test.js",
  line: 10,
  column: 15
}
```

---

# 7. `new` + nombre

Ya lo hemos visto:

```text
    at new Foo (/home/carlos/test.js:10:15)
```

Pero conceptualmente lo importante es que el prefijo:

```text
new
```

**no forma parte del nombre de la función**.

---

# 8. `eval`

Aquí empieza la fiesta.

V8 puede generar:

```text
    at eval (eval at foo (/home/carlos/test.js:10:15), <anonymous>:1:2)
```

Hay dos localizaciones implicadas:

```text
eval at foo (/home/carlos/test.js:10:15)
```

y:

```text
<anonymous>:1:2
```

La localización final del frame es:

```text
<anonymous>:1:2
```

pero V8 conserva además información sobre dónde se produjo el `eval`.

Esto es una de las razones por las que **no conviene pensar que un frame siempre tiene simplemente `archivo:línea:columna` entre paréntesis**.

---

# 9. `eval` sin nombre

También pueden aparecer variantes de evaluación sin una función normal.

Por ejemplo, conceptualmente:

```text
    at eval (eval at <anonymous> (...), <anonymous>:1:2)
```

Aquí ya tienes varios niveles de información.

Para una primera versión de tu parser, yo trataría `eval (...)` como una categoría especial.

---

# 10. Archivos `file://`

En Node, dependiendo del contexto:

```text
    at foo (file:///home/carlos/test.js:10:15)
```

La localización sigue siendo:

```text
file:///home/carlos/test.js
```

No deberías asumir que `file` es un path POSIX.

---

# 11. URLs

En Chrome:

```text
    at foo (https://example.com/app.js:100:20)
```

o:

```text
    at https://example.com/app.js:100:20
```

Es decir, el "archivo" puede ser realmente una URL.

Yo llamaría al campo simplemente:

```js
location
```

o `file`, pero teniendo claro que **puede no ser un filesystem path**.

---

# 12. `<anonymous>`

V8 puede utilizar:

```text
<anonymous>
```

como localización:

```text
    at foo (<anonymous>:10:15)
```

o dentro de `eval`.

Por tanto:

```js
file: "<anonymous>"
```

es perfectamente válido.

---

# 13. Código nativo

Puedes encontrarte:

```text
    at foo (native)
```

o representaciones relacionadas con código nativo.

Aquí **no existe necesariamente**:

```text
archivo:línea:columna
```

Por tanto no puedes exigir esos tres componentes a todos los frames.

Algo como:

```js
{
  function: "foo",
  native: true,
  file: null,
  line: null,
  column: null
}
```

es mucho más robusto.

---

# 14. `node:` / internals de Node

En Node puedes encontrar:

```text
    at foo (node:internal/modules/cjs/loader:1234:14)
```

o:

```text
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
```

Esto **sigue siendo un frame normal de V8**:

```js
{
  function: "process.processTicksAndRejections",
  file: "node:internal/process/task_queues",
  line: 95,
  column: 5
}
```

Lo único especial es la localización.

---

# 15. `file:line:column` sin paréntesis

Esta es importante.

Puede ser:

```text
    at /home/carlos/test.js:10:15
```

en vez de:

```text
    at foo (/home/carlos/test.js:10:15)
```

Así que conceptualmente V8 tiene al menos estas dos formas fundamentales:

```text
at NAME (LOCATION)
```

y:

```text
at LOCATION
```

---

# 16. El nombre de función puede contener espacios

No deberías hacer algo como:

```js
line.split(" ")
```

para obtener el nombre.

Por ejemplo, V8 puede representar funciones con nombres derivados del código que contienen información más compleja.

La estructura sintáctica que te interesa es:

```text
at [PREFIX] [FUNCTION] ([LOCATION])
```

donde `FUNCTION` **no deberías limitarlo a `[a-zA-Z0-9_.]+`**.

---

# 17. El propio error

Antes de los frames puedes tener:

```text
Error: Boom
```

o:

```text
TypeError: Cannot read properties of undefined
```

o simplemente:

```text
Boom
```

Y también errores cuyo mensaje contiene saltos de línea:

```text
Error: primera línea
segunda línea
tercera línea
    at foo (/test.js:10:15)
```

Por eso yo **no asumiría que la primera línea es necesariamente el encabezado completo**.

---

# 18. `Error.stackTraceLimit`

Además, el número de frames no está necesariamente limitado a una cantidad fija.

En V8 existe:

```js
Error.stackTraceLimit = 20;
```

y puedes modificarlo:

```js
Error.stackTraceLimit = Infinity;
```

Así que tu parser no debería tener ninguna expectativa sobre cuántos frames vienen.

---

# 19. La estructura que yo asumiría

Para tu proyecto, reduciría **todo V8** a estas categorías:

```text
FRAME
│
├── named
│   └── at NAME (LOCATION)
│
├── anonymous
│   └── at LOCATION
│
├── constructor
│   └── at new NAME (LOCATION)
│
├── async
│   └── at async NAME (LOCATION)
│
├── native
│   └── at NAME (native)
│
└── eval
    └── at eval (EVAL_LOCATION, LOCATION)
```

Y después `LOCATION`:

```text
LOCATION
│
├── /path/file.js:10:20
├── file:///path/file.js:10:20
├── https://example.com/file.js:10:20
├── node:internal/....:10:20
└── <anonymous>:10:20
```

Eso ya te da una base bastante sólida.

---

## Y hay una decisión de diseño que yo tomaría en tu caso

**No intentaría reproducir la estructura textual de V8.**

Es decir, no haría que tu resultado fuera:

```js
{
  at: "at foo (/test/a.js:10:15)"
}
```

sino:

```js
{
  function: "foo",
  isAsync: false,
  isConstructor: false,
  isNative: false,
  file: "/test/a.js",
  line: 10,
  column: 15
}
```

Y para `eval` añadiría información específica solamente cuando exista:

```js
{
  function: "eval",
  isEval: true,

  file: "<anonymous>",
  line: 1,
  column: 2,

  evalOrigin: {
    function: "foo",
    file: "/test/a.js",
    line: 10,
    column: 15
  }
}
```

Así, cuando pases después a Firefox, **Firefox tiene que adaptarse a tu representación, no al revés**.

Y para V8 hay una ventaja enorme: si estás en Node/Chrome y puedes utilizar `Error.prepareStackTrace`, puedes obtener muchos de estos datos mediante `CallSite` y **evitar completamente el parser textual**. El parser textual te queda como fallback.
