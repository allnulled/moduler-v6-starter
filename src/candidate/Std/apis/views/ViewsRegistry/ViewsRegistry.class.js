class ViewsRegistry {

  static validateView(viewDefinition) {
    $moduler.assert(typeof viewDefinition === "object", `Required parameter «viewDefinition» to be object but «${typeof viewDefinition}» was found instead on «ViewsRegistry.registerView»`);
    $moduler.assert(typeof viewDefinition.name === "object", `Required parameter «viewDefinition.name» to be string but «${typeof viewDefinition}» was found instead on «ViewsRegistry.registerView»`);
  }

  static {
    $moduler.toolkit.makeClass([
      Std.functions.IntrospectableInterfaceFactory(
        "views",
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
    this.views = {};
  }

  onRegister({ key, value, output }) {
    $moduler.assert(typeof value === "object", `Required parameter «view» to be object but «${typeof value}» was found instead on «ViewsRegistry.prototype.onRegister»`);
    $moduler.assert(typeof value.name === "string", `Required parameter «view.name» to be string but «${typeof value.name}» was found instead on «ViewsRegistry.prototype.onRegister»`);
    $moduler.assert(typeof value.template === "string", `Required parameter «view.template» to be string but «${typeof value.template}» was found instead on «ViewsRegistry.prototype.onRegister»`);
    if(Std.externals.Vue2) {
      Std.externals.Vue2.component(value.name, value);
    }
  }

  onUnregister({ key }) {
    const id = Array.isArray(key) ? key[key.length-1] : key;
    $moduler.assert(typeof id === "string", `Required parameter «name» to be string but «${typeof id}» was found instead on «ViewsRegistry.prototype.onRegister»`);
    if(Std.externals.Vue2) {
      delete Std.externals.Vue2.options.components[id];
    }
  }

  static globalInstance = this.$ = new this();

  static {
    Conectamos_Std_views_con_las_views_del_global: {
      Std.views = this.globalInstance.views;
    }
  }

}