


## La API de Errores de Std

- Consiste en una extensión de la clase nativa `Error`
    - con propiedades estáticas
    - con métodos estáticos
    - con métodos prototipo
    - el constructor no se sobreescribe
- Utiliza ErrorStackFrame y ErrorStackParser
   - de https://www.stacktracejs.com/ ambos
- Cumple para 6 utilidades, no más:
```js
// 1. Normalizar errores de cualquier input a Error:
Error.normalize("mensaje de error");
Error.normalize({ name: "ErrorName", message: "error message" });
Error.normalize(new Error("whatever"));

// 2. Añadir un error a otro con normalización intermedia:
const error = Error.normalize({name:"BaseError"})
error.adding({name:"AttachedError"});

// 3. Relanzar (o lanzar, funciona igual) un error:
error.adding({name:"AttachedError2"}).rethrow();

// 4. Pasar a objeto:
const data = error.toObject();
// Puedes extender localmente los Error.tools.ignoredErrorFrames así:
const data2 = error.toObject([ "async SomeClass.someMethod","/path/to/some/file.js",]);

// 5. Pasar a objeto con persecución de error:
const data = await error.toProsecution(); // sin formateos, porque si no, nos liamos

// 6. Formateo de error y de lista de errores:
Error.tools.formatError(error, "%name => %message [%stack]\n%frames");
Error.tools.formatErrorList(errors, "%name => %message [%stack]\n%frames", "%functionName:%lineNumber:%columnNumber");
```


