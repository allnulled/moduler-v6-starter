keyOf(complement) {
  const condition = Object.keys(this.checker.value).includes(complement);
  return this.checker.clarify(this.negated ? !condition : condition, ["is", ...(this.negated ? ["not"] : []), "keyOf"]);    
}