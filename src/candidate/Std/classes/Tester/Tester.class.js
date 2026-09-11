class Tester extends Std.all.Process {
  static {
    Object.assign(this, {
      evaluateDirectory: $compiler.inject.source("./evaluateDirectory.function.js"),
      _evaluateDirectoryInNodejs: $compiler.inject.source("./_evaluateDirectoryInNodejs.function.js"),
    });
  }
}