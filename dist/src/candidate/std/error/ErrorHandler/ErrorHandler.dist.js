module.exports = $moduler.import(
  [
    "@/src/candidate/std/console/AnsiColors/AnsiColors.class.js",
    "@/src/candidate/std/error/ErrorFactory/ErrorFactory.class.js",
  ],
  function ([AnsiColors, ErrorFactory]) {
    return class ErrorHandler {
      constructor(error) {
        this.error = error;
        this.normalize(error);
      }
      static Lazy = class Lazy {
        constructor() {
          this._actions = [];
        }
        add(...args) {
          this._actions.push(["add", ...args]);
          return this;
        }
        print(...args) {
          this._actions.push(["print", ...args]);
          return this;
        }
        silence(...args) {
          this._actions.push(["silence", ...args]);
          return this;
        }
        rethrow(...args) {
          this._actions.push(["rethrow", ...args]);
          return this;
        }
        get handler() {
          const actions = this._actions
            .concat([])
            .map((action) => (errorHandler) => {
              const m = action[0];
              return errorHandler[m](...action.splice(1));
            });
          return function (error) {
            const handler = ErrorHandler.pick(error);
            return actions.map((action) => action(handler));
          };
        }
      };
      static get lazy() {
        return new this.Lazy();
      }
      static pick(...args) {
        return new ErrorHandler(...args);
      }
      static rethrow(error) {
        return ErrorHandler.pick(error).rethrow();
      }
      static add(newError) {
        return (error) => {
          ErrorHandler.pick(error).add(newError).rethrow();
        };
      }
      rethrow(error) {
        throw (this.error = error || this.error);
      }
      print() {
        console.log(this.error);
        return this;
      }
      silence() {
        return this;
      }
      add(anotherError) {
        this.error.history.push(
          typeof anotherError === "string"
            ? new Error(anotherError)
            : anotherError,
        );
        return this;
      }
      normalize(error) {
        if (error instanceof Error) {
          error.history = error.history || [];
        }
      }
    };
  },
);
