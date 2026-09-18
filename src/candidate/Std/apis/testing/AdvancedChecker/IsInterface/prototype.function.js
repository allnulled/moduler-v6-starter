function()  {
  const condition = typeof this.checker.value === "function";
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "function"]);
}