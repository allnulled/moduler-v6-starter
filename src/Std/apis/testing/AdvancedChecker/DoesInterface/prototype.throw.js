throw () {
  if (typeof this.checker.value !== "function") throw new Error(`Method «Checker.prototype.does${this.negated ? ".not" : ""}.throw» cannot be used against «${typeof this.checker.value}» only functions!`);
  let condition = false;
  let catched = false;
  try {
    this.checker.value();
  } catch (error) {
    catched = error;
    condition = true;
  }
  return this.checker.clarify(this.negated ? !condition : condition, ["does", ...(this.negated ? ["not"] : []), "throw"], { catched });
}