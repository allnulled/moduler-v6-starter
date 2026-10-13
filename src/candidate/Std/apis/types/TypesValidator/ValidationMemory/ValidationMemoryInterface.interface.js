// @interface:ValidationMemoryInterface
{
  prototype: {
    get labels() {
      return this._labels = this._labels || {};
    },
    set labels(label) {
      return this._labels = this._labels;
    },
    unclonableProperties: [ "dataPointer", "astPointer" ],
  },
  static: {},
}