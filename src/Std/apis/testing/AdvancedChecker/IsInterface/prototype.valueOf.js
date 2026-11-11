valueOf(complement) {
  const condition = Object.values(complement).includes(this.checker.value);
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "valueOf"]);    
}