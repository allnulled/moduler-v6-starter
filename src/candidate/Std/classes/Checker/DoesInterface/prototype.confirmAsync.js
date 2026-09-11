async confirmAsync () {
  if (typeof this.checker.value !== "function") throw new Error(`Method «Checker.prototype.does${this.negated ? ".not" : ""}.confirmAsync» cannot be used against «${typeof this.checker.value}» only functions!`);
  const catched = await this.checker.value();
  const condition = catched === true;
  return this.checker.clarify(this.negated ? !condition : condition, ["does", ...(this.negated ? ["not"] : []), "confirmAsync"], { catched });
}