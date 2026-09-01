module.exports = $moduler.import([], function () {
  return (function () {
    class CheckerIs {
      constructor(checker) {
        this.checker = checker;
      }
      get not() {
        const checker = this.checker.clone();
        checker.not = true;
        return new Checker.Is(checker);
      }
      _check(name, predicate, ...args) {
        const checker = this.checker.clone();
        return checker.evaluate(predicate, ...args);
      }
      defined() {
        return this._check("defined", (value) => value !== undefined);
      }
      truthy() {
        return this._check("truthy", (value) => Boolean(value));
      }
      falsy() {
        return this._check("falsy", (value) => !Boolean(value));
      }
      boolean() {
        return this._check("boolean", (value) => typeof value === "boolean");
      }
      number() {
        return this._check("number", (value) => typeof value === "number");
      }
      string() {
        return this._check("string", (value) => typeof value === "string");
      }
      object() {
        return this._check(
          "object",
          (value) => value !== null && typeof value === "object",
        );
      }
      null() {
        return this._check("null", (value) => value === null);
      }
      function() {
        return this._check("function", (value) => typeof value === "function");
      }
      array() {
        return this._check("array", (value) => Array.isArray(value));
      }
      instanceOf(Type) {
        return this._check(
          "instanceOf",
          (value) => value instanceof Type,
          Type,
        );
      }
      date() {
        return this._check("date", (value) => value instanceof Date);
      }
      lessThan(value) {
        return this._check("lessThan", (current) => current < value, value);
      }
      moreThan(value) {
        return this._check("moreThan", (current) => current > value, value);
      }
      equalTo(value) {
        return this._check("equalTo", (current) => current === value, value);
      }
      equalOrLessThan(value) {
        return this._check(
          "equalOrLessThan",
          (current) => current <= value,
          value,
        );
      }
      equalOrMoreThan(value) {
        return this._check(
          "equalOrMoreThan",
          (current) => current >= value,
          value,
        );
      }
    }

    class CheckerHas {
      constructor(checker) {
        this.checker = checker;
      }
      get not() {
        const checker = this.checker.clone();
        checker.not = true;
        return new Checker.Has(checker);
      }
      _check(name, predicate, ...args) {
        const checker = this.checker.clone();
        return checker.evaluate(predicate, ...args);
      }
      property(property) {
        return this._check(
          "property",
          (value) =>
            value != null &&
            Object.prototype.hasOwnProperty.call(value, property),
          property,
        );
      }
      value(value) {
        return this._check(
          "value",
          (current) => Object.values(current).includes(value),
          value,
        );
      }
    }

    class CheckerIts {
      constructor(checker) {
        this.checker = checker;
      }
      property(property) {
        const checker = this.checker.clone();
        checker.operation = `its.${String(property)}`;
        if (checker.value == null || !(property in Object(checker.value))) {
          return checker.onError(checker);
        }
        checker.value = checker.value[property];
        return checker;
      }
      get is() {
        return new Checker.Is(this.checker);
      }
      get has() {
        return new Checker.Has(this.checker);
      }
      its(property) {
        return new Checker.Its(this.checker).property(property);
      }
    }

    class Checker {
      static Is = CheckerIs;
      static Has = CheckerHas;
      static Its = CheckerIts;
      constructor(value) {
        this.value = value;
        this.not = false;
        this.operation = null;
        this.onSuccess = () => true;
        this.onError = () => false;
      }
      clone() {
        const clone = new this.constructor(this.value);
        clone.onSuccess = this.onSuccess;
        clone.onError = this.onError;
        clone.not = this.not;
        clone.operation = this.operation;
        return clone;
      }
      get predicatesOf() {
        return {
          is: Object.getOwnPropertyNames(Checker.Is.prototype).filter(
            (name) => name !== "constructor",
          ),
          has: Object.getOwnPropertyNames(Checker.Has.prototype).filter(
            (name) => name !== "constructor",
          ),
          its: Object.getOwnPropertyNames(Checker.Its.prototype).filter(
            (name) => name !== "constructor",
          ),
        };
      }
      evaluate(predicate, ...args) {
        this.operation = predicate;
        const result = Boolean(predicate(this.value, ...args));
        const success = this.not ? !result : result;
        return success ? this.onSuccess(this) : this.onError(this);
      }
      get is() {
        return new Checker.Is(this);
      }
      get has() {
        return new Checker.Has(this);
      }
      its(property) {
        return new Checker.Its(this).property(property);
      }
    }

    class Asserter {
      constructor() {}
    }

    const assert = (condition, message) => {
      if (!condition) throw new Error(message);
    };

    Test: {
      const original = {
        f: function () {},
        s: "ok",
        n: 10,
        b: true,
      };
      const x = new Checker(original);
      assert(x.is.object(), "Error on «x is object»");
      assert(x.its("f").is.function(), "Error on «x.f is function»");
      assert(x.its("s").is.string(), "Error on «s is string»");
      assert(x.its("f").is.not.string(), "Error on «x.f is not.string»");
      assert(x.its("b").is.boolean(), "Error on «x.b is boolean»");
      assert(x.its("n").is.number(), "Error on «x.n is number»");
      assert(x.its("n").is.not.string(), "Error on «x.n is not.string»");
    }
  })();
});
