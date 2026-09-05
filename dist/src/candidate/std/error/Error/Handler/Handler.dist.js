module.exports = $moduler.import(
  [
    "@/dist/src/candidate/std/console/AnsiColors/AnsiColors.dist.js",
    "@/dist/src/candidate/std/error/Error/Factory/Factory.dist.js",
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
      static normalize = ErrorFactory.normalize;
      static add(newError) {
        return (error) => {
          ErrorHandler.pick(error).add(newError).rethrow();
        };
      }
      rethrow() {
        throw this.error;
      }
      print() {
        console.log(this.error);
        return this;
      }
      silence() {
        return this;
      }
      add(anotherError) {
        const error =
          typeof anotherError === "string"
            ? new Error(anotherError)
            : anotherError;
        this.constructor.normalize(this.error);
        this.error.std.history.push(error);
        return this;
      }
      normalize(error) {
        return this.constructor.normalize(error);
      }
    };
  },
);
