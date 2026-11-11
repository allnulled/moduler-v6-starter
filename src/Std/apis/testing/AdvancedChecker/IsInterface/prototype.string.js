string()  {
  const condition = typeof this.checker.value === "string";
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "string"]);
}