{
  static: {
    isBrowser: $compiler.inject.source("./static.isBrowser.js"),
    isNodejs: $compiler.inject.source("./static.isNodejs.js"),
  },
}