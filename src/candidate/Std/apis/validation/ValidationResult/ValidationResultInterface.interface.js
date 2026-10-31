// @interface:ValidationResultInterface
{
  static: {},
  prototype: {
    onCreate: function() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ValidationResultInterface.prototype.onCreate"});
      this.output = {};
      this.deambiguation = null;
      this.errors = [];
    }
  },
}