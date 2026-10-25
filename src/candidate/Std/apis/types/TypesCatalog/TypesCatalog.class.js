class TypesCatalog {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.functions.IntrospectableInterfaceFactory("all", "getType", "setType", "hasType", "deleteType", "initializeType", "listTypes"),
      Std.interfaces.TypesCatalogInterface,
    ], this);
    Instancia_global: {
      this.globalInstance = this.new;
      globalThis.$types = this.globalInstance.all;
    }
  }
}