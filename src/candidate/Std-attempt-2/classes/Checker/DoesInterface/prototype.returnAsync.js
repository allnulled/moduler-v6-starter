async returnAsync (complement) {
  if (typeof this.checker.value !== "function") throw new Error(`Method «Checker.prototype.does${this.negated ? ".not" : ""}.returnAsync» cannot be used against «${typeof this.checker.value}» only functions!`);
  const catched = await this.checker.value();
  const condition = catched === complement;
  return this.checker.clarify(this.negated ? !condition : condition, ["does", ...(this.negated ? ["not"] : []), "returnAsync"], { catched });
}