// @interface:ConfigurableInterface
{
  prototype: {
    config: function(props = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"ConfigurableInterface.prototype.config"});
      return Object.assign(this, props);
    }
  },
  static: {},
}