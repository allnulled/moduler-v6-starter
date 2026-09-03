module.exports = $moduler.import([], function () {
  return class Cycler {
    static get new() {
      return new this();
    }
    steps(steps = {}) {
      this._steps = steps;
      return this;
    }
    cycle(cycle = []) {
      this._cycle = cycle;
      return this;
    }
    injection(injection = {}) {
      this._injection = injection;
      return this;
    }
    scope(scope = {}) {
      this._scope = scope;
      return this;
    }
    async start(injection = {}) {
      if (injection) Object.assign(this.injection, injection);
      if (!this._cycle)
        throw new Error(
          "Property «this._cycle» must be defined on «Cycler.prototype.start»",
        );
      if (!Array.isArray(this._cycle))
        throw new Error(
          "Property «this._cycle» must be array on «Cycler.prototype.start»",
        );
      for (let index = 0; index < this._cycle.length; index++) {
        const step = this._cycle[index];
        let callback;
        let scope = this._scope;
        let injection = { ...this._injection };
        let result;
        if (typeof step === "string") {
          if (!(step in this.steps))
            throw new Error(
              `Required «this.steps[${index}]» to be a known step but «${step}» was found intead on «Cycler.prototype.start»`,
            );
          callback = this.this.steps[step];
        } else if (typeof step === "function") {
          callback = step;
        } else if (typeof step === "object") {
          if (!Array.isArray(step))
            throw new Error(
              `Required «step» to be array when object but «${typeof step}» was found intead on «Cycler.prototype.start»`,
            );
          const [_callback, _injection, _scope] = step;
          callback = _callback;
          if (_injection) Object.assign(injection, _injection);
          if (_scope) scope = _scope;
        }
        Scopify_call_or_not: {
          result = scope ? callback.call(scope, injection) : step(injection);
        }
      }
    }
  };
});
