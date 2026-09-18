function IntrospectableInterfaceFactory (introspectableField, getName = "get", setName = "set", hasName = "has", initializeName = "initialize", listName = "list") {
  // @factory:IntrospectableInterfaceFactory
  return {
    // @interface:IntrospectableInterface
    prototype: {
      [getName]: function get(key) {
        return Std.all.Introspector.get(this[introspectableField], key.split("/"));
      },
      [setName]: function set(key, value) {
        return Std.all.Introspector.set(this[introspectableField], key.split("/"), value);
      },
      [hasName]: function has(key) {
        return Std.all.Introspector.has(this[introspectableField], key.split("/"));
      },
      [initializeName]: function initialize(key, value) {
        return Std.all.Introspector.initialize(this[introspectableField], key.split("/"), value);
      },
      [listName]: function list() {
        return this[introspectableField];
      },
    },
    static: {},
  }
}