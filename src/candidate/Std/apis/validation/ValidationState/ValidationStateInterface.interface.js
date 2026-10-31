// @interface:ValidationStepInterface
{
  static: {},
  prototype: {
    addStep: $compiler.inject.source("./function.addStep.js"),
    onCreate: function() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ValidationStateInterface.prototype.onCreate"});
      this.result = Std.all.ValidationResult.new;
    }
  },
}