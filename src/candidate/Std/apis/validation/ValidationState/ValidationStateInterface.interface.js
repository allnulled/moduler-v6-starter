// @interface:ValidationStepInterface
{
  static: {},
  prototype: {
    newStep: $compiler.inject.source("./function.newStep.js"),
    onCreate: function() {
      this.result = Std.all.ValidationResult.new;
    }
  },
}