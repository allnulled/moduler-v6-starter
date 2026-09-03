module.exports = $moduler.import([], function () {
  return class Isolate {
    utils = {
      IsolationError: class IsolationError extends Error {
        constructor(...args) {
          super(...args);
          this.name = "IsolationError";
        }
      },
      assert(condition, message) {
        if (!condition) throw new this.IsolationError(message);
      },
    };
    static Sync = class IsolateSync extends Isolate {
      run(data = null) {
        if (typeof data === "function") this.callback = data;
        const context = this.getContext(data);
        try {
          if (this._before) this._before(context);
          context.output = this.callback(context);
          if (this._after) this._after(context);
          return context.output;
        } catch (error) {
          this.handle(error, context);
        } finally {
          if (this._finally) this._finally(context);
        }
      }
    };
    static Async = class IsolateAsync extends Isolate {
      async run(data = null) {
        if (typeof data === "function") this.callback = data;
        const context = this.getContext(data);
        let hadError = undefined;
        try {
          if (this._before) this._before(context);
          context.output = this.callback(context);
          if (this._after) this._after(context);
          return context.output;
        } catch (error) {
          hadError = error;
          this.handle(error, context);
        } finally {
          if (this._finally) this._finally(context);
          if (hadError) throw hadError;
        }
      }
    };
    static get sync() {
      return new this.Sync();
    }
    static get async() {
      return new this.Async();
    }
    get rethrow() {
      this._silence = false;
      return this;
    }
    get silence() {
      // @CUIDADITO con usar esta función, chaval. Puede ser catatostrico.
      this._silence = true;
      this._print = false;
      return this;
    }
    get print() {
      this._print = true;
      return this;
    }
    getContext(extensions = {}) {
      this.utils.assert(
        typeof extensions === "object",
        `Parameter «extensions» must be object on «Isolate.prototype.function»`,
      );
      return {
        config: this._config,
        params: this._params,
        locals: this._locals,
        ...extensions,
      };
    }
    function(callback) {
      this.utils.assert(
        typeof callback === "function",
        `Parameter «callback» must be function on «Isolate.prototype.function»`,
      );
      this.callback = callback;
      return this;
    }
    config(config) {
      this.utils.assert(
        typeof config === "object",
        `Parameter «config» must be object on «Isolate.prototype.config»`,
      );
      this._config = config;
      return this;
    }
    params(params) {
      this.utils.assert(
        typeof params === "object",
        `Parameter «params» must be object on «Isolate.prototype.params»`,
      );
      this._params = params;
      return this;
    }
    locals(locals) {
      this.utils.assert(
        typeof locals === "object",
        `Parameter «locals» must be object on «Isolate.prototype.locals»`,
      );
      this._locals = locals;
      return this;
    }
    handle(error) {
      if (this._error)
        (error.history = error.history || []).push(...this._error);
      if (this._print) console.log(error);
      if (this._catch) this._catch(error, this.getContext());
      if (this._silence !== true) throw error;
    }
    info(data) {
      this.utils.assert(
        typeof data === "function",
        `Parameter «data» must be function on «Isolate.prototype.info»`,
      );
      this._info = data;
      return this;
    }
    before(beforeHandler) {
      this.utils.assert(
        typeof beforeHandler === "function",
        `Parameter «finallyHandler» must be function on «Isolate.prototype.before»`,
      );
      this._before = beforeHandler;
      return this;
    }
    after(afterHandler) {
      this.utils.assert(
        typeof afterHandler === "function",
        `Parameter «finallyHandler» must be function on «Isolate.prototype.after»`,
      );
      this._after = afterHandler;
      return this;
    }
    finally(finallyHandler) {
      this.utils.assert(
        typeof finallyHandler === "function",
        `Parameter «finallyHandler» must be function on «Isolate.prototype.finally»`,
      );
      this._finally = finallyHandler;
      return this;
    }
    catch(catchHandler) {
      this.utils.assert(
        typeof catchHandler === "function",
        `Parameter «catchHandler» must be function on «Isolate.prototype.catch»`,
      );
      this._catch = catchHandler;
      return this;
    }
    error(errorOrMessage) {
      (this._error = this._error || []).push(
        typeof errorOrMessage === "string"
          ? new Error(errorOrMessage)
          : errorOrMessage,
      );
      return this;
    }
    run(callback) {
      throw new Error("Method «run» must be overriden from «Isolate»");
    }
  };
});
