class ViewTraitsRegistry {
  
  static validateViewTrait(trait) {
    $moduler.assert(typeof trait === "object", `Required parameter «trait» to be object but «${typeof trait}» was found instead on «ViewTraitsRegistry.prototype.onRegister»`);
  }

  static {
    $moduler.toolkit.makeClass([
      Std.functions.IntrospectableInterfaceFactory(
        "viewTraits",
        "get",
        "set",
        "has",
        "delete",
        "initialize",
        "list",
        "onRegister",
        "onUnregister",
        "|",
      ),
    ], this);
  }

  constructor() {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.ViewTraitsRegistry.constructor"});
    this.viewTraits = {};
  }

  onRegister(input) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.ViewTraitsRegistry.prototype.onRegister"});
    this.constructor.validateViewTrait(input);
  }

  onUnregister({ key }) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.ViewTraitsRegistry.prototype.onUnregister"});
    // @OK.
  }

  static globalInstance = this.$ = new this();

  static {
    Conectamos_Std_objects_ViewTraits_con_las_view_traits_del_global: {
      Std.objects.ViewTraits = this.globalInstance.viewTraits;
    }
  }

}