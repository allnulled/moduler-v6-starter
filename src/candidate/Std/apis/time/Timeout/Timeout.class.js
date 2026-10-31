class Timeout {
  
  static {
    $moduler.toolkit.makeClass([
      // Std.interfaces.InstantiableInterface,
    ], this);
  }
  
  static of(milliseconds) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Timeout.of"});
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

}