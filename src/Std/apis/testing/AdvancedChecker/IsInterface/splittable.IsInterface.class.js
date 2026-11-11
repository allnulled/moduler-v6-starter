class IsInterface {

  constructor(checker) {
    this.checker = checker;
    this.negated = false;
  }

  get not() {
    this.negated = !this.negated;
    return this;
  }

  object() {
    const condition = typeof this.checker.value === "object";
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "object"]);
  }

  string()  {
    const condition = typeof this.checker.value === "string";
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "string"]);
  }

  boolean()  {
    const condition = typeof this.checker.value === "boolean";
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "boolean"]);
  }

  number()  {
    const condition = typeof this.checker.value === "number";
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "number"]);
  }

  function()  {
    const condition = typeof this.checker.value === "function";
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "function"]);
  }

  array()  {
    const condition = Array.isArray(this.checker.value);
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "array"]);
  }

  promise() {
    const condition = this.checker.value instanceof Promise;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "promise"]);
  }

  date() {
    const condition = this.checker.value instanceof Date;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "date"]);
  }

  error() {
    const condition = this.checker.value instanceof Error;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "error"]);
  }

  regex() {
    const condition = this.checker.value instanceof RegExp;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "regex"]);
  }

  normalNumber() {
    const condition = typeof this.checker.value === "number" && !NumberisNaN(this.checker.value);
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "normalNumber"]);
  }

  equalTo(complement) {
    const condition = this.checker.value === complement;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "equalTo"]);
  }

  differentFrom(complement) {
    const condition = this.checker.value !== complement;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "differentFrom"]);
  }

  lessThan(complement) {
    const condition = this.checker.value < complement;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "lessThan"]);
  }

  lessOrEqualTo(complement) {
    const condition = this.checker.value <= complement;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "lessOrEqualTo"]);    
  }

  moreThan(complement) {
    const condition = this.checker.value > complement;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "moreThan"]);
  }

  moreOrEqualTo(complement) {
    const condition = this.checker.value >= complement;
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "moreOrEqualTo"]);    
  }

  keyOf(complement) {
    const condition = Object.keys(this.checker.value).includes(complement);
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "keyOf"]);    
  }

  valueOf(complement) {
    const condition = Object.values(complement).includes(this.checker.value);
    return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "valueOf"]);    
  }

}
