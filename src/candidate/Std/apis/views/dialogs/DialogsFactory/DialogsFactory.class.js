class DialogsFactory {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.functions.IntrospectableInterfaceFactory(
        "factories",
        // getName:
        "getFactory",
        // setName:
        "setFactory",
        // hasName:
        "hasFactory",
        // deleteName:
        "deleteFactory",
        // initializeName:
        "initializeFactory",
        // listName:
        "listFactories",
        // onRegisterName:
        "onRegisterFactory",
        // onUnregisterName:
        "onUnregisterFactory",
        // splitterSymbol:
        "/",
      ),
    ], this);
  }
  onCreate() {
    this.factories = {};
  }
  make(id, callback) {
    $moduler.assert(typeof id === "string", `Required parameter «id» to be string on «DialogsFactory.register»`);
    $moduler.assert(typeof callback === "function", `Required parameter «callback» to be function on «DialogsFactory.register»`);
    $moduler.assert(id in this.factories, `Cannot register «id=${id}» because it is already registered on «DialogsFactory.register»`);
    this.factories[id] = callback;
  }
  static globalInstance = this.new;
  static $ = this.globalInstance;
}