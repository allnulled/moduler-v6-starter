Error_extensions_from_Std: {
  Error.stackTraceLimit = 4;
  Error.create = function (input) {
    if (input instanceof Error) return input.normalizeForStd();
    if (typeof input === "string") return (new Error(input)).normalizeForStd();
    if (typeof input === "object") return Object.assign(new Error(""), input).normalizeForStd();
    return Object.assign(new Error(`Malformed error of type «${typeof input}» was created`), { input });
  };
  Error.throw = function () {
    throw this;
  };
  Error.toThrower = function (input, ...args) {
    return Error.create(input).toThrower(...args);
  };
  Error.prototype.normalizeForStd = function() {
    if (!("std" in this)) this.std = {};
    if (!("history" in this.std)) this.std.history = [];
    return this;
  }
  Error.prototype.adding = function (anotherError) {
    this.normalizeForStd();
    this.std.history.push(Error.create(anotherError));
    return this;
  };
  Error.prototype.throw = function (callback = null) {
    this.normalizeForStd();
    if (typeof callback === "function") callback(this);
    throw this;
  };
  Object.defineProperty(Error.prototype, "thrown", {
    get() {
      throw this;
    }
  });
  Object.defineProperty(Error.prototype, "handle", {
    get() {
      return this.toThrower();
    }
  });
  Error.prototype.toThrower = function (callback = null, parameters = null) {
    return (error) => {
      Error.create(error);
      if (callback) callback(error, this, parameters);
      throw Error.create(error).adding(this);
    };
  };
}