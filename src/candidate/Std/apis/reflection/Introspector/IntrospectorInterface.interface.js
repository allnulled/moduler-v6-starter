// @interface:IntrospectorInterface
{
  prototype: { },
  static: {
    get: $compiler.inject.source("./function.get.js"),
    set: $compiler.inject.source("./function.set.js"),
    has: $compiler.inject.source("./function.has.js"),
    initialize: $compiler.inject.source("./function.initialize.js"),
  },
}