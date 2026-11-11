// @interface:BasedirInterface
{
  static: {
    pathSymbols: $compiler.inject.source("./static.pathSymbols.js"), 
    superiorPathOf: $compiler.inject.source("./static.superiorPathOf.js"),
    splitPath: $compiler.inject.source("./static.splitPath.js"),
    removePathSymbols: $compiler.inject.source("./static.removePathSymbols.js"),
    appendPathSeparator: $compiler.inject.source("./static.appendPathSeparator.js"),
  },
  prototype: {
    resolvePath: $compiler.inject.source("./prototype.resolvePath.js"),
    normalizationOf: $compiler.inject.source("./prototype.normalizationOf.js"),
    rootpathOf: $compiler.inject.source("./prototype.rootpathOf.js"),
    basepathOf: $compiler.inject.source("./prototype.basepathOf.js"),
  },
}