object() {
  const condition = typeof this.checker.value === "object";
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "object"]);
}