{
  boolean: Std.types.boolean = $compiler.inject.source("./boolean/boolean.class.js"),
  number: Std.types.number = $compiler.inject.source("./number/number.class.js"),
  string: Std.types.string = $compiler.inject.source("./string/string.class.js"),
  array: Std.types.array = $compiler.inject.source("./array/array.class.js"),
  object: Std.types.object = $compiler.inject.source("./object/object.class.js"),
  function: Std.types.function = $compiler.inject.source("./function/function.class.js"),
  null: Std.types.null = $compiler.inject.source("./null/null.class.js"),
}