function clarify (condition, predicate) {
  let output = undefined;
  let tmp = undefined;
  tmp = this.onCheckBefore(predicate, condition);
  output = typeof tmp === "undefined" ? output : tmp;
  if(condition && this.onCheckTrue) {
    tmp = this.onCheckTrue(predicate);
    output = typeof tmp === "undefined" ? output : tmp;
  } else if(this.onCheckFalse) {
    tmp = this.onCheckFalse(predicate);
    output = typeof tmp === "undefined" ? output : tmp;
  }
  tmp = this.onCheckAfter(predicate, condition);
  output = typeof tmp === "undefined" ? output : tmp;
  return typeof output === "undefined" ? this : output;
}