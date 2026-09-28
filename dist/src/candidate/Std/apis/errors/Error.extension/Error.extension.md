


## La API de Errores de Std

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
