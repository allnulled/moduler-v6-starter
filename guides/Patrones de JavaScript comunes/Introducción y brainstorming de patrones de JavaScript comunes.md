# Introducción y brainstorming de patrones de JavaScript comunes

Esta guía es una introducción a patrones comunes de JavaScript y una lista de ellos, además de clasificaciones.

## Índice

- [Introducción y brainstorming de patrones de JavaScript comunes](#introducción-y-brainstorming-de-patrones-de-javascript-comunes)
  - [Índice](#índice)
  - [Introducción a los ejemplos](#introducción-a-los-ejemplos)
  - [Patrones de creación](#patrones-de-creación)
    - [Newable: instancia blanca](#newable-instancia-blanca)
    - [Creable: instancia con parámetros](#creable-instancia-con-parámetros)
    - [Clonable: instancia con herencia simple de otra instancia](#clonable-instancia-con-herencia-simple-de-otra-instancia)
    - [SpecificallyClonable: instancia con herencia compleja de otra instancia](#specificallyclonable-instancia-con-herencia-compleja-de-otra-instancia)
    - [Loadable](#loadable)
  - [Patrones de errores](#patrones-de-errores)
    - [ErrorProxy](#errorproxy)
  - [Patrones de ejecución](#patrones-de-ejecución)
    - [Startable](#startable)
  - [Patrones de reutilización](#patrones-de-reutilización)
    - [Definitions](#definitions)
  - [Notas](#notas)
    - [Nota 1 sobre réplicas de objetos en memoria al programar](#nota-1-sobre-réplicas-de-objetos-en-memoria-al-programar)
  - [Patrones de colección](#patrones-de-colección)
    - [Colección por objeto simple](#colección-por-objeto-simple)
    - [Colección por objeto con niveles de abstracción](#colección-por-objeto-con-niveles-de-abstracción)

## Introducción a los ejemplos

Los ejemplos intentarán replicar lógicas de escenarios reales, pero no serán funcionales completos, sino fragmentos parciales de piezas imaginarias más grandes de lo que el ejemplo alcanza.

## Patrones de creación

Los siguientes patrones son para instanciar objetos.

### Newable: instancia blanca

- 1) Quieres crear una instancia de una clase.
- 2) No quieres proporcionar ningún parámetro.
- Usa un `getter` porque no necesita parámetros.
```js
const db = Database.new;
const app = Application.new;
```

### Creable: instancia con parámetros

- 1) Quieres crear una instancia de una clase.
- 2) Sí quieres proporcionar parámetros.
```js
const framework = Framework.create({ app, db }, { createdAt: new Date() });
```

### Clonable: instancia con herencia simple de otra instancia

- 1) Quieres crear una instancia de una clase.
- 2) Quieres que sea una copia de otra instancia.
- 3) La única operación de copia es sobreescribirle algunas propiedades.
- Es un patrón muy común y útil, donde abandonas 1 objeto para continuar con otro que hereda de este pero sobreescribe partes.
- Es muy usado para *chaining syntaxes* porque:
   - en un punto del chaining
   - puedes arrastrar un estado volátil
   - hasta llevarlo a una acción y ahí consumirlo
   - manteniendo el estado original intacto y seguir reutilizándolo
```js
const main = BaseDirectory.create({ basedir: "/root/of/application" });
const src = main.clone({ basedir: "./src" });
const test = main.clone({ basedir: "./test" });
const dist = main.clone({ basedir: "./dist" });
```
- Idealmente:
   - `clonable = newable.new + 

### SpecificallyClonable: instancia con herencia compleja de otra instancia

- 1) Quieres crear una instancia de una clase.
- 2) Quieres que sea una copia de otra instancia.
- 3) La operación de copia es más complicada que sobreescribirle algunas propiedades superficialmente.
- Es cuando el `Clonable` se queda corto con un *override simple* y quieres personalizarlo.
```js
const mainSettings = await Settings.create({ source: "settings/application" }).load();
const profileSettings = mainSettings.clone({ source: "settings/users/${username}/prefrences" }).load();
```

### Loadable

- 1) Quieres que una instancia tenga un método para que se autorrevise el estado y lo valide y complete.
- Se considera **patrón de creación** porque es el método de justo después de la creación, muy típicamente
   - pero, no es necesaria ni únicamente ese patrón.
   - `Loadable` solo indica que tiene un proceso en el que se revisa el estado.
   - Y hay que tener cuidado en cómo se programa este método, porque si lo haces mal:
      - Puedes dejar punteros huérfanos
      - **Puedes acumular réplicas de objetos en memoria** (*[Nota 1 sobre réplicas de objetos en memoria al programar](#nota-1-sobre-réplicas-de-objetos-en-memoria-al-programar)*)
- El caso más común es que quieres que una clase cargue en su estado datos a partir de:
   - URLs
   - ficheros
   - bases de datos
   - otros sockets
- Es muy común, algunos ejemplos:
   - un objeto `Database` que quieres que abra una conexión en la misma creación de instancia
   - un objeto `User` de un ORM que quieres que se llene de la base de datos
   - un objeto `Settings` que se tiene que completar en función de un fichero
```js
// Lo identificas así:
await Database.create({ host, port }).connect();
await User.create({ email }).synchronize();
await Settings.create({ file }).reload();
// Se descompone en esto:
await Database.new.config({ host, port }).connect();
await User.new.config({ email }).synchronize();
await Settings.new.config({ file }).reload();
// Pero al final lo que nos interesa sea llegar a poder hacer esto:
const db = await Database.connect({ host, port });
const user = await User.synchronize({ email });
const settings = await Settings.reload({ file });
```

La cuestión con el `loadable` más problemática son 3:

- normalmente no quieres llamarlo `load`, sino darle un poco más de especificidad del caso:
   - `synchronize`
   - `connect`
   - `fetch`
   - `update`
   - `reload`
   - `loadFile`
   - `loadUrl`
   - etc.
- fácilmente puedes querer tener varios procesos de recarga diferentes en 1 misma clase
- no hay código *no específico* que poder abstraer de todos estos métodos a la vez

Por tanto, `Loadable` queda de momento como un patrón demasiado abstracto todavía.









## Patrones de errores

A continuación son algunos patrones relacionados con los errores.

### ErrorProxy

- Quieres crear un error de la nada y decidir su `name` y `message` en runtime
   - y relanzarlo
   - u obtener un handler que continúe otro error decorándolo con el primero
- Quieres coger un error de un `catch` de `try` y decorarlo con otro error.
- Quieres coger un error de un `catch` de `try` y diseccionarlo e inverstigarlo.
- Quieres coger un error de un `catch` de `Promise` y obtener un `callback` que gestione otro error y lo decore con el primero.

```js
const AjaxErrorHandler = ErrorProxy.new.config({ name:"Bad ajax request", message:"The ajax request was failed for some reason" }).handler(["print", "rethrow"]);
const AjaxErrorHandler = ErrorProxy.new.config({ name:"Bad ajax request", message:"The ajax request was failed for some reason" }).rethrower(["print"]);
const AjaxErrorHandler = ErrorProxy.new.config({ name:"Bad ajax request", message:"The ajax request was failed for some reason" }).rethrower(["print"]);

const AjaxErrorHandler = ErrorProxy.new.config({ name:"Bad ajax request", message:"The ajax request was failed for some reason" }).handler(["investigate","print","decorate","rethrow"]);

fetch("whatever").catch(ErrorProxy.new.config(Definitions.error.AjaxError).handler(Definitions.error.handler.Basic));

fetch("whatever").catch(ErrorProxy.new.restore("error.AjaxError").clone().handler("error.handler.Basic"));

(error) => {
    console.log(error);
    throw error;
}

fetch("whatever").catch(AjaxErrorHandler);
```




## Patrones de ejecución


### Startable

- Quieres:
   - coger un objeto
   - definirle métodos
   - y ejecutar listas de métodos (o funciones foráneas)
      - como un proceso independiente
         - sea síncrono, en serie o en paralelas
      - con unos parámetros independientes
      - que reutiliza un subtipo del objeto original

```js
Startable.new.restore("cycle.Demonstration").clone().startSync(["main"]);
Startable.new.restore("steps.Something").clone().startSync(["main"]);
```



## Patrones de reutilización

### Definitions

Con el patron `Definitions` tienes un objeto y pillas cosas de él:

```js
Definitions.error = {};
Definitions.error["connectivity error"] = {name: "", messageBuilder: (arg1, arg2) => `` };
Definitions.error["server not found error"] = {name: "", messageBuilder: (arg1, arg2) => `` };
Definitions.error["server denied permissions"] = {name: "", messageBuilder: (arg1, arg2) => `` };
Definitions.handlers = {};
Definitions.handlers["print"] = console.log;
Definitions.handlers["throw"] = error => throw error;
Definitions.handlers["rethrow"] = Definitions.handlers["throw"];
Definitions.handlers["investigate"] = error => ErrorProxy.investigate(error);
```

Luego para usarlo tienes que tener algún método:

```js
const ConnectivityError = Definitions.find(["error", "connectivity error"])
```

























## Notas

### Nota 1 sobre réplicas de objetos en memoria al programar

**Puedes acumular réplicas de objetos en memoria**.

Tú sabes que esto:

```js
const utils = {
    readFile: function() {},
    writeFile: function() {},
    deleteFile: function() {},
};
```

No es lo mismo que esto:

```js
const utils = {};
utils.readFile = function() {};
utils.writeFile = function() {};
utils.deleteFile = function() {};
```

Porque, por ejemplo, por la mitad puedes hacer:

```js
const utils = {};
utils.trify = function(c) {...};
utils.readFile = utils.trify(function() {});
utils.writeFile = utils.trify(function() {});
utils.deleteFile = utils.trify(function() {});
// Y aquí poder hacer esto:
utils.readFile("file.txt");
utils.readFile.trify("file.txt");
```

OK. Pues el patrón 1, el bonito, el que pensarías que es el correcto, es con el que corres el riesgo de duplicar objetos.
- Resulta contradictorio, en frameworks como `vue2` te piden dar 1 objeto, en el `data` de los `components`.
   - Y `vue2` luego aprovecha ese cambio de estado del objeto, para triggear cambios en otros lados.
   - Y en `react`, programación reactiva, también, pedían siempre tirar un objeto nuevo que aplaste al anterior, en el `.setData({...})`.
   - O en... `redux`, creo. No sé los nuevos, `pinia`, etc.
- Pero si me preguntas a mí, lo correcto es lo último, lo primero es lo bonito y puede que ligera, breve, imperceptiblemente, más rápido
   - o incluso igual no
   - no lo sé y no me he puesto a averiguarlo.
   - lo resolví como que era el patrón más legible
   - con ModulerV6/CompilerV6 hemos llevado esa legibilidad al extremo y
      - ahora no es tan problema que sea legible o no
      - y estamos replanteando estilos de código iniciales
      - y aquí hay un debate:
         - declaraciones unilateral
            - este objeto, en grupo, es así
         - VS declaraciones imperativa
            - esta propiedad es esto (x cada propiedad)

- Las declaraciones unilaterales son más estéticas y fácilmente más performativas.
- Las declaraciones imperativas son más flexibles.
- La flexibilidad en las declaraciones puede plantear problemas, pero normalmente no:
   - o son valores
   - o son métodos
      - y su acceso...

Vale? Hay un tema. No es superimportante, pero me gustaría comprender el problema de verdad, porque escalado, es el problema que da origen a Promise, al fin y al cabo.

OK. He estado pensando, y he concluido esto:

> Es un problema de secuencialidad de carga: primero se carga una colección, luego se carga otra colección (que puede reusar la anterior).

Por tanto, todas las funciones **del mismo nivel de abtracción** deberían poder agruparse.

## Patrones de colección

Estos patrones sirven para mantener registros o listas.

### Colección por objeto simple

- Un `{}` es el método más sencillo de recolección.

### Colección por objeto con niveles de abstracción

- Esto es cuando no todo puedes cargarlo de golpe en el mismo objeto.
   - puedes cargarlo, pero o no de golpe, o no en el mismo objeto.
- Cuando cargas una colección (de colecciones), a veces necesitas reutilizar funcionalidades anteriores para generar las nuevas.
- Sucede cuando pretendías declarar una API bonitamente, pero te encuentras con esto:
```js
const Files = {
    trify: ...,
    makeTrifiable: ...,
    // Y aquí lanzará error:
    readFile: Files.makeTrifiable(FilesDriver.readFile),
    writeFile: Files.makeTrifiable(FilesDriver.writeFile),
    deleteFile: Files.makeTrifiable(FilesDriver.deleteFile),
}
```
- La solución es pasarlo a esto:
```js
const Files = {};

Object.assign(Files, {
    trify: function (callback, defaultValue) {
        return function(...args) {
            try {
                return callback(...args);
            } catch(error) {
                return defaultValue;
            }
        };
    },
    makeTriable: function(callback, defaultValue) {
        return Object.assign(callback, {
            try: Files.trify(callback),
        });
    }
});

Object.assign(Files, {
    readFile: Files.makeTriable(function() {
        const filepath = this.resolvePath(file);
        // ...
    }),
    writeFile: Files.makeTriable(function() {
        const filepath = this.resolvePath(file);
        // ...
    }),
    deleteFile: Files.makeTriable(function() {
        const filepath = this.resolvePath(file);
        // ...
    }),
});
```
- Pero claro, y en una clase? En una clase, así:
```js
class Files {
    static {
        // Nivel 1:
        Object.assign(this, {
            trify: function (callback, defaultValue) {
                return function(...args) {
                    try {
                        return callback(...args);
                    } catch(error) {
                        return defaultValue;
                    }
                };
            },
            makeTriable: function(callback, defaultValue) {
                return Object.assign(callback, {
                    try: this.trify(callback),
                });
            }
        });
        // Nivel 2:
        Object.assign(this, {
            resolvePath: function() {},
            readFile: this.makeTriable(function(file) {
                const filepath = this.resolvePath(file);
                // ...
            }),
            writeFile: this.makeTriable(function(file) {
                const filepath = this.resolvePath(file);
                // ...
            }),
            deleteFile: this.makeTriable(function(file) {
                const filepath = this.resolvePath(file);
                // ...
            }),
        });
    }
}
```
- Los niveles se definen como: colecciones cuyos ítems no se reutilizan entre sí **para fabricarse**:
   - tú puedes hacer que copyFile use readFile y writeFile y otras del mismo nivel sin problema.
   - lo que no puedes hacer es generar copyFile utilizando a readFile y writeFile:
      - puedes hacerlo, pero entonces debes hacer que copyFile esté en una capa superior o más de readFile y writeFile
   - podría hacerse todo por asignación de propiedad, en lugar de agrupar niveles por colecciones
      - pero agruparlas es la fórmula más madura de presentación: por capas
      - porque así entiendes rápido que primero va un grupo, luego otro: que es lo único que hay que entender, de hecho.
   - una mala solución a este problema puede llevarte a:
      - sobreescritura de globales
      - abuso del modulador
      - generación de scopes/callbacks intermedios
   - es fácil caer en estas malas soluciones por varias razones, por ejemplo
      - la solución con objetos puede ser intuitiva
      - pero la solución con clases no es nada intuitiva
         - se ven igual, o muy parecidas
         - pero en clases, el `static {}` es la única instrucción que te permite hacer esto y definir la clase en 1 misma sentencia js
            - también puedes ir sobreescribiendo propiedades a la clase después de definirla
            - pero claro, dispersas la definición, el código se va haciendo feo
- Esta reflexión giraba entorno a cuándo y cómo usar la declaración estática VS declaración progresiva
   - Y la solución parece que al final es esa:
   - Siempre que sea posible, estática, es mucho más legible
   - Y la declaración progresiva la empleas, pero:
      - contra bloques estáticos: porque agrupas funcionalidades por nivel
      - lo menos posible: para hacer la separación mínima, los mínimos grupos que te hagan entender rápido el orden y los grupos de carga.

