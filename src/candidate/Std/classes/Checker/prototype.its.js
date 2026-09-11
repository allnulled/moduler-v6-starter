function its(property) {
  if(typeof property === "string") return Checker.check(this.value[property]);
  if(!Array.isArray(property)) throw new Error(`Parameter «property» must be string or array but «${typeof property}» was found on «Checker.prototype.its»`);
  let pivot = this.value;
  for(let index=0; index<property.length; index++) {
    const name = property[index];
    pivot = pivot[name];
  }
  return this.constructor.check(pivot);
}