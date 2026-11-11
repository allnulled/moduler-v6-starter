// @interface:ConfigurableInterface
{
  prototype: {
    config: function(props = {}) {
      $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.interfaces.ConfigurableInterface.prototype.config"});
      return Object.assign(this, props);
    }
  },
  static: {},
}