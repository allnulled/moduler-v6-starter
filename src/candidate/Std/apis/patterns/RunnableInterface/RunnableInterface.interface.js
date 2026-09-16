// @interface:RunnableInterface
{
  static: { },
  prototype: {
    runAsync: $compiler.inject.template("./template.runSyncAsync.js", {
      mode: "async"
    }),
    runSync: $compiler.inject.template("./template.runSyncAsync.js", {
      mode: "sync"
    }),
  },
}