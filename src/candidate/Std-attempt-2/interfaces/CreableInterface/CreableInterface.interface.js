{
  static: {
    create: function(...args) {
      return new this(...args);
    },
    get new() {
      return new this();
    }
  },
  prototype: {},
}