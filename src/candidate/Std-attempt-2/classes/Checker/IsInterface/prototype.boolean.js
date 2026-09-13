boolean()  {
  const condition = typeof this.checker.value === "boolean";
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "boolean"]);
}