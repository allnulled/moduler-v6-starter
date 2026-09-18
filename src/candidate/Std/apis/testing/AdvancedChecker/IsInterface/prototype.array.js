array()  {
  const condition = Array.isArray(this.checker.value);
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "array"]);
}