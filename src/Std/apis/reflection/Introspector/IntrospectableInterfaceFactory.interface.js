function IntrospectableInterfaceFactory (
  introspectableField,
  getName = "get",
  setName = "set",
  hasName = "has",
  deleteName = "delete",
  initializeName = "initialize",
  listName = "list",
  onRegisterName = "onRegister",
  onUnregisterName = "onUnregister",
  splitterSymbol = "/",
) {
  // @factory:IntrospectableInterfaceFactory
  return {
    // @interface:IntrospectableInterface
    prototype: {
      [getName]: function get(key) {
        return Std.all.Introspector.get(this[introspectableField], typeof key === "string" ? key.split(splitterSymbol) : key);
      },
      [setName]: function set(key, value) {
        const output = Std.all.Introspector.set(this[introspectableField], typeof key === "string" ? key.split(splitterSymbol) : key, value);
        Std.functions.triggerMethodIfExists(this, onRegisterName, [{ key, value, output }], this);
        return output;
      },
      [hasName]: function has(key) {
        return Std.all.Introspector.has(this[introspectableField], typeof key === "string" ? key.split(splitterSymbol) : key);
      },
      [deleteName]: function _delete(key) {
        const output = Std.all.Introspector.delete(this[introspectableField], typeof key === "string" ? key.split(splitterSymbol) : key);
        Std.functions.triggerMethodIfExists(this, onUnregisterName, [{ key, output }], this);
        return output;
      },
      [initializeName]: function initialize(key, value) {
        const localSymbol = {};
        const output = Std.all.Introspector.initialize(this[introspectableField], typeof key === "string" ? key.split(splitterSymbol) : key, value, localSymbol);
        if(output !== localSymbol) Std.functions.triggerMethodIfExists(this, onRegisterName, [{ key, value, output }], this);
        return output;
      },
      [listName]: function list() {
        return this[introspectableField];
      },
    },
    static: {},
  }
}