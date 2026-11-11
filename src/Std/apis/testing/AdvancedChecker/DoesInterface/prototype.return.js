return (complement) {
  if (typeof this.checker.value !== "function") throw new Error(`Method «Checker.prototype.does${this.negated ? ".not" : ""}.return» cannot be used against «${typeof this.checker.value}» only functions!`);
  const catched = this.checker.value();
  const condition = catched === complement && typeof catched !== "undefined";
  return this.checker.clarify(this.negated ? !condition : condition, ["does", ...(this.negated ? ["not"] : []), "return"], { catched });
}