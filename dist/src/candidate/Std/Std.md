


### Tabla de contenidos

  - [Tabla de contenidos](#tabla-de-contenidos)
- [Std](#std)
- [Std global object](#std-global-object)
  - [La API de Errores de Std](#la-api-de-errores-de-std)
- [Std.assert](#stdassert)
- [JsonStringifier.stringify(input:any, beautify:boolean=true)](#jsonstringifierstringifyinputany-beautifybooleantrue)
- [Std.all.Printer.debug](#stdallprinterdebug)
- [Std.all.Printer.json](#stdallprinterjson)
- [Std.classes.Printer.ask(question=string,options={},...others=[])](#stdclassesprinteraskquestionstringoptionsothers)
- [Std.functions.triggerMethodIfExists](#stdfunctionstriggermethodifexists)
- [Std.classes.Tester.evaluateDirectory](#stdclassestesterevaluatedirectory)
- [Std.classes.Tester.evaluateCallback](#stdclassestesterevaluatecallback)
- [Std.classes.Tester.evaluateDirectory](#stdclassestesterevaluatedirectory)
- [Std.classes.PropertiesMerger.mergeByPropertiesList](#stdclassespropertiesmergermergebypropertieslist)
- [Std.classes.Basedir](#stdclassesbasedir)
  - [Definición](#definicion)
  - [Interfaces](#interfaces)
  - [Instanciación](#instanciacion)
  - [Propiedades](#propiedades)
  - [Métodos prototipo más útiles](#metodos-prototipo-mas-utiles)
  - [Métodos estáticos más útiles](#metodos-estaticos-mas-utiles)
  - [Métodos menos útiles pero disponibles](#metodos-menos-utiles-pero-disponibles)

## Std

- Entry point for Std library.
- Depends on:
   - peggyjs
- Injects:
   - ./Std.object.js



## Std global object

- Type: object
- Global: yes
- Properties:
   - all:Object
   - objects:Object
   - functions:Object
   - traits:Object
   - interfaces:Object
   - classes:Object
   - parsers:Object
   - types:Object
- Loads:
   - Wave 0: native extensions
   - Wave 1: elemental funcions, clases and interfaces
   - Wave 2: utility interfaces
   - Wave 3: utility classes
   - Wave 4: core of types
   - Wave 5: filesystem
   - Wave 6: ...
- ...



### La API de Errores de Std

- Consiste en una extensión de la clase nativa `Error`
    - con propiedades estáticas
    - con métodos estáticos
    - con métodos prototipo
    - el constructor no se sobreescribe
- Utiliza ErrorStackFrame y ErrorStackParser
   - de https://www.stacktracejs.com/ ambos
- Los prototipo:
   - `@Error.prototype.adding(any) => @self Error`
   - `@Error.prototype.toObject() => @data Object`
   - `@Error.prototype.toProsecution() => @data Object`
   - `@Error.prototype.rethrow() !=> @self Error`
   - `@Error.prototype.config(@props object) => @self Error`
- Los static:
   - `@Error.normalize function(any) => error`
   - `@Error.formatError(@error error) => error`
   - `@Error.formatList(@errors [...error]) => @errors [...{}]`
   - `@Error.stringify(@data any) => @json string`
   - `@Error.prosecuteList(@errors [...error]) => @data [...{}]`
   - `@Error.stringifyProsecutedList(@errors [...error]) => @json string`



## Std.assert

- Acepta:
   - condition:boolean
   - message:string|object|error|any



## JsonStringifier.stringify(input:any, beautify:boolean=true)

- `input:any`: valor a stringificar
- `beautify:boolean=true`: si lo quieres embellecer
- ventajas:
   - imprime bien instancias de "Error"
   - previene de circularidad
   - transforma Function con .toString()



## Std.all.Printer.debug

- Acepta cualquier parámetro
- Imprime normal el índice, el tipo y el valor



## Std.all.Printer.json

- Acepta cualquier parámetro
- Imprime por json si puede, si no como Printer.debug



## Std.classes.Printer.ask(question=string,options={},...others=[])

- Async function
- Pregunta al usuario por consola, parando la ejecución con await hasta que responda o se interrumpa el proceso
- Tiene una historieta para que si se interrumpe el proceso, que pasa con refrescador todo el rato, salga de las llamadas que se van a acumular de golpe al soltar.
   - Quiero decir, que hay una casuística que justifica



## Std.functions.triggerMethodIfExists

- Útil para unilinear hooks de clase.
- Recibe:
   - base:object|function|any - objeto del método a triggear
   - method:string - nombre del método a usar
   - args?:array - parámetros que pasarle
   - scope?:any - scope al que bindear



## Std.classes.Tester.evaluateDirectory

- Mismas firmas que `Std.classes.Tester.evaluateBrowserDirectory`.



## Std.classes.Tester.evaluateCallback

- Método para evaluar un callback de test en node.js o browser
- Su firma es: 
   - `callback:Function` - el test.
      - recibe en `arguments[0]:Object={Std,tester:Std.classes.Tester,...options}`, `
   - `options?:Object` - opciones que se inyectan al `callback` asignadas en `arguments[0]:Object`.
      - los triggers pueden acceder también en `arguments[0].options`
- Lanzará los triggers de:
   - `onBeforeTest`
   - `onAfterTest`
   - `onTestSuccess`
   - `onTestFailure`


## Std.classes.Tester.evaluateDirectory

- Método para evaluar un directorio de tests en node.js
- El fichero tiene que exportar una función asíncrona o síncrona.
- La firma es `evaluateBrowserDirectory(options:Object)`
- Tiene solo una opción en options:
   - `{directory:String}`: necesario.
      - tiene que ser un rootpath al directorio real donde están los tests
      - **y también** tiene que existir en `$moduler.settings.data.browser.test.directories` como clave
      - el `@/dev/settings.js` tiene en `#browser/test/directories` un mapa con:
         - como clave, un rootpath así: '@/dist/www/dev/test/xxx'
         - como valor, da igual, porque se encarga el `DevBinaryV6.prototype.utils.exportDevSettings` de copiar las claves y completar los valores en `@/dist/www/dev/settings/publicable.json`
         - y la llamada a `exportDevSettings` la puedes provocar desde el `devbin loop` simplemente guardando `@/dev/settings.js`
         - por lo cual, si añades un nuevo test de navegador en la colección de test públicos, guarda de nuevo el `@/dev/settings.js` y los publicables se actualizarán automáticamente, de `@/dev/settings.js` a `@/dist/www/dev/settings/publicable.json`
- Lanzará los mismos triggers que evaluateDirectory.



## Std.classes.PropertiesMerger.mergeByPropertiesList

- Acepta:
   - instructions:object(key=string,merger=function(input:[previousValue,currentValue],output:nextValue=array))
   - input:array(object)



## Std.classes.Basedir

### Definición

> Clase para crear instancias que puedasn localmente:
>  - Juntar rutas parciales correctamente:
>     - mediante `Basedir.prototype.resolvePath`
>  - Normalizar y resolver rutas relativas:
>     - mediante `Basedir.prototype.normalizationOf`
>     - a raíz `this.rootdir = string` con `@/` y
>     - a base `this.basedir = string` con `./`
>  - Extraer referencias relativas de raíz y de base:
>     - mediante `Basedir.prototype.{basepathOf,rootpathOf}`
>  - Ofrecer utilidades relacionadas con la resolución y reconstrucción de rutas
>     - como reconstruir el directorio superior:
>        - mediante `Basedir.prototype.{basepathOf,rootpathOf}`
>     - como añadir el símbolo de unión de rutas al final:
>        - mediante `Basedir.prototype.appendPathSeparator`
>     - y otros.

### Interfaces

- `Std.interfaces.InstantiableInterface`
- `Std.interfaces.BasedirInterface`

### Instanciación

```js
const base = Std.classes.Basedir.new.config({
    rootdir: "root",
    basedir: "root/basedir",
});
```

### Propiedades

```js
base.basedir = string
base.rootdir = string
```

### Métodos prototipo más útiles

- `Basedir.prototype.resolvePath(subpaths:[string]) => string`
- `Basedir.prototype.normalizationOf(subpath:string) => string`
- `Basedir.prototype.basepathOf(subpath:string) => string`
- `Basedir.prototype.rootpathOf(subpath:string) => string`

### Métodos estáticos más útiles

- `Basedir.superiorPathOf(subpath:string) => string`
- `Basedir.splitPath(subpath:string) => string`

### Métodos menos útiles pero disponibles

- `Basedir.removePathSymbols(subpath:string)`
- `Basedir.appendPathSeparator(subpath:string)`