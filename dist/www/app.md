


#### Tabla de contenidos

  - [Tabla de contenidos](#tabla-de-contenidos)
- [Std](#std)
- [Std global object](#std-global-object)
- [Error native extensions](#error-native-extensions)
- [Std.assert](#stdassert)
- [Std.all.Printer.debug](#stdallprinterdebug)
- [Std.all.Printer.json](#stdallprinterjson)
- [Std.classes.Printer.ask(question=string,options={},...others=[])](#stdclassesprinteraskquestionstringoptionsothers)
- [Std.functions.triggerMethodIfExists](#stdfunctionstriggermethodifexists)
- [Std.classes.Tester.evaluateDirectory](#stdclassestesterevaluatedirectory)
- [Std.classes.Tester.evaluateCallback](#stdclassestesterevaluatecallback)
- [Std.classes.Tester.evaluateDirectory](#stdclassestesterevaluatedirectory)
- [Std.classes.PropertiesMerger.mergeByPropertiesList](#stdclassespropertiesmergermergebypropertieslist)

### Std

- Entry point for Std library.
- Depends on:
   - peggyjs
- Injects:
   - ./Std.object.js



### Std global object

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
-



### Error native extensions

- Hay 3 extensiones nativas al Error:
   - Error.normalize(input:String|Error|Object):
      - crea o devuelve un error
      - puede usarse con String, Error u Object especificando name y message.
      - antes de retornarlo, normaliza el error.std.history = []
   - Error.throw(error:String|Error|Object):
      - lanza un error global estáticamente
   - Error.prototype.adding(error:String|Error|Object)
      - añade un error al error.std.history del que lo lanza


### Std.assert

- Acepta:
   - condition:boolean
   - message:string|object|error|any



### Std.all.Printer.debug

- Acepta cualquier parámetro
- Imprime normal el índice, el tipo y el valor



### Std.all.Printer.json

- Acepta cualquier parámetro
- Imprime por json si puede, si no como Printer.debug



### Std.classes.Printer.ask(question=string,options={},...others=[])

- Async function
- Pregunta al usuario por consola, parando la ejecución con await hasta que responda o se interrumpa el proceso
- Tiene una historieta para que si se interrumpe el proceso, que pasa con refrescador todo el rato, salga de las llamadas que se van a acumular de golpe al soltar.
   - Quiero decir, que hay una casuística que justifica



### Std.functions.triggerMethodIfExists

- Útil para unilinear hooks de clase.
- Recibe:
   - base:object|function|any - objeto del método a triggear
   - method:string - nombre del método a usar
   - args?:array - parámetros que pasarle
   - scope?:any - scope al que bindear



### Std.classes.Tester.evaluateDirectory

- Método para evaluar un directorio de tests en node.js
- El fichero tiene que exportar una función asíncrona o síncrona.
- La firma es `evaluateDirectory(options:Object)`
- Tiene varias opciones en options:
   - `{directory:String}`: necesario, ruta del directorio
   - `{filename?:String}`: nombre de fichero
      - a) si sí se especifica, el primer nivel de ficheros se considera directorio, y que el test está en el mismo nombre de fichero que se indica aquí
      - b) si no se especifica, el primer nivel de ficheros se consideran los tests, directamente
      - El framework para sus tests usa la a).
   - `{filter?:Function}`: función para filtrar por nombre los ficheros que sí quieres usar como test
      - recibe un objeto con `{ id:String, path:String, callback:Function }
   - `{ignored?:[String]}`: lista de substrings que, de aparecer en el fichero, no quieres usar como test
      - si empieza con `^` se discrimina usando `startsWith` en lugar de `includes`
      - se aplica después del filter
      - parámetro un poco pachim pacham, seguramente se acabe cambiando por una función igual que filter o incluso desapareciendo
      - desaconsejo su uso
   - `{title?:String}`: nombre de la colección de tests, se usa como referencia en logs y errores.
   - `{injection?}:Object`
      - `progresser:Std.classes.Progresser`: se puede usar en los tests para monitorizar el progreso de cada test callback
      - `...otros`: puedes inyectar lo que quieras a los tests
- Lanzará los triggers, que puedes configurar con `.config({ ... })`:
   - por parte propia:
      - `onBeforeTestCollection`
      - `onAfterTestCollection`
   - por parte del `evaluateCallback`:
      - `onBeforeTest`
      - `onTestSuccess`
      - `onTestFailure`
      - `onAfterTest`



### Std.classes.Tester.evaluateCallback

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


### Std.classes.Tester.evaluateDirectory

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



### Std.classes.PropertiesMerger.mergeByPropertiesList

- Acepta:
   - instructions:object(key=string,merger=function(input:[previousValue,currentValue],output:nextValue=array))
   - input:array(object)
