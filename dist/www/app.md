


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



### Std.classes.PropertiesMerger.mergeByPropertiesList

- Acepta:
   - instructions:object(key=string,merger=function(input:[previousValue,currentValue],output:nextValue=array))
   - input:array(object)
