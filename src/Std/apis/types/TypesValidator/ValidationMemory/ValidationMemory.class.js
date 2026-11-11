class ValidationMemory {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      // @interface:ValidationMemoryInterface
      {
        prototype: {
          get labels() {
            return this._labels = this._labels || {};
          },
          set labels(label) {
            return this._labels = this._labels;
          },
          unclonableProperties: ["ast", "data", "astPointer", "dataPointer"],
        },
        static: {},
      },
    ], this);
  }
}