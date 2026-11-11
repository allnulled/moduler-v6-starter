error() {
  const condition = this.checker.value instanceof Error;
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "error"]);
}