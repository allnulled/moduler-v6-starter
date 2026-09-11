{
  as(typeId, args = []) {
    if (typeof typeId === "function") return typeId.call(this, ...args);
    if (typeof typeId === "object") return Object.assign(this, typeId);
    if (typeof typeId === "string") {
      if (!(typeId in Cycle.all)) throw new Error(`Parameter «typeId» when string it must be a known key for «Cycle.all» but «${typeId}» was found instead on «Typeable.prototype.as»`);
      return this.as(Cycle.all[typeId]);
    }
    throw new Error(`Parameter «input» must be object, string or function but «${typeof input}» was found instead on «Typeable.prototype.as»`);
  }
}