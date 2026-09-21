// @interface:CreableInterface
{
  prototype: {

    get new() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"CreableInterface.prototype.new"});
      return this.constructor.create();
    },

  },
  static: {
    
    get new() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"CreableInterface.static.new"});
      return this.create();
    },
    
    create: function(config = {}, ...constructorArgs) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", {name:"CreableInterface.static.create"});
      const instanze = new this(...constructorArgs);
      let output = instanze;
      Apply_new_configurations: {
        instanze.config(config);
      }
      Trigger_hook_on_create_if_any: {
        if(instanze.onCreate) {
          output = instanze.onCreate({ parent: this, config }, ...constructorArgs) || output;
        }
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", {name:"CreableInterface.static.create"});
      return output;
    },
  },
  
}