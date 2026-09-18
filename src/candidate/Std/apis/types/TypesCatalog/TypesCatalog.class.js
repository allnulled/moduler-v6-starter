class TypesCatalog {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.IntrospectableInterfaceFactory("all", "getType", "setType", "hasType", "initializeType", "listTypes"),
      Std.interfaces.TypesCatalogInterface,
    ], this);
    Instancia_global: {
      this.globalInstance = this.new;
      globalThis.$types = this.globalInstance.all;
    }
  }
}