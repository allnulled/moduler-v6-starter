class ComputedProperties {
  
  static create(definitions, instance = {}) {
    for (const [name, definition] of Object.entries(definitions)) {
      Object.defineProperty(instance, name, {
        enumerable: true,
        configurable: true,
        get: definition.get,
        set: definition.set
      });
    }
    return instance;
  }

}