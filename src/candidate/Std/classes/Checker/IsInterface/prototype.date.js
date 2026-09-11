date() {
  const condition = this.checker.value instanceof Date;
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "date"]);
}