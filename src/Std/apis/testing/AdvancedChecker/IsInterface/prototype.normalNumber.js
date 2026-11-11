normalNumber() {
  const condition = typeof this.checker.value === "number" && !NumberisNaN(this.checker.value);
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "normalNumber"]);
}