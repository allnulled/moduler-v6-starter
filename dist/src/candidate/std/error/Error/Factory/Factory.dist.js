module.exports = $moduler.import(
  ["@/src/candidate/std/console/AnsiColors/AnsiColors.class.js"],
  function ([AnsiColors]) {
    return class ErrorFactory {
      static get new() {
        return new ErrorFactory();
      }
      static normalize(error) {
        if (typeof error !== "object") return error;
        if (typeof error.std === "undefined") error.std = {};
        if (typeof error.std.history === "undefined") error.std.history = [];
        return error;
      }
      constructor(base = new Error()) {
        this._error = base;
        this.constructor.normalize(this._error);
      }
      name(name) {
        this._error.name = name;
        return this;
      }
      message(message) {
        this._error.message = message;
        return this;
      }
      history(history) {
        this._error.std.history = history;
        return this;
      }
      add(error) {
        this._error.std.history.push(
          typeof error === "string" ? new Error(error) : error,
        );
        return this;
      }
      throw() {
        throw this._error;
      }
      build() {
        return this._error;
      }
    };
  },
);
