// @interface:CheckerInterface
{
  prototype: {
    check: function(condition, ...otherParameters) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", {name:"CheckerInterface.prototype.check"});
      Std.functions.triggerMethodIfExists(this, "onCheckStart", otherParameters);
      if(condition) {
        Std.functions.triggerMethodIfExists(this, "onCheckSuccess", otherParameters);
      } else {
        Std.functions.triggerMethodIfExists(this, "onCheckError", otherParameters);
      }
      Std.functions.triggerMethodIfExists(this, "onCheckEnd", otherParameters);
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", {name:"CheckerInterface.prototype.check"});
      return condition;
    }
  },
  static: {},
}