module.exports = $moduler.import(
  ["@/src/candidate/std/console/AnsiColors/AnsiColors.class.js"],
  function ([AnsiColors]) {
    return class ErrorFactory {
      static get new() {
        return new ErrorFactory();
      }
      constructor(base = new Error()) {
        this._error = base;
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
        this._error.history = history;
        return this;
      }
      add(error) {
        this._error.history = this._error.history || [];
        this._error.history.push(
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
