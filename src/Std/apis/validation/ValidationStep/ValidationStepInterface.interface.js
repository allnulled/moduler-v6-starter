// @interface:ValidationStepInterface
{
  prototype: {
    onCreate: function() {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.interfaces.ValidationStepInterface.prototype.onCreate"});
      this.dataPointer = [];
      this.validatorPointer = [];
    }
  },
  static: {},
}