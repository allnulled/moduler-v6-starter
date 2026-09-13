promise() {
  const condition = this.checker.value instanceof Promise;
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "promise"]);
}