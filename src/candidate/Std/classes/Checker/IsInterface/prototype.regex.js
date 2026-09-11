regex() {
  const condition = this.checker.value instanceof RegExp;
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "regex"]);
}