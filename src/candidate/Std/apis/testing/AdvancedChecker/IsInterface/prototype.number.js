number()  {
  const condition = typeof this.checker.value === "number";
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "number"]);
}