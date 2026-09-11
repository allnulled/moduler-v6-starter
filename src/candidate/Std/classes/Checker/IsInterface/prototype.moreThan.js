moreThan(complement) {
  const condition = this.checker.value > complement;
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "moreThan"]);
}