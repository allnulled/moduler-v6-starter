static addInterface(base, interfaceObject) {
  this.assert(["object", "function"].includes(typeof base), `Parameter «base» must be function or object but «${typeof base}» was found instead on «ClassSkiller.addInterface»`);
  this.assert(base !== null, `Parameter «base» cannot be null on «ClassSkiller.addInterface»`);
  this.assert(typeof interfaceObject === "object", `Parameter «interfaceObject» must be object but «${typeof base}» was found instead on «ClassSkiller.addInterface»`);
  this.assert(interfaceObject !== null, `Parameter «interfaceObject» cannot be null on «ClassSkiller.addInterface»`);
  const keys = Object.keys(interfaceObject);
  this.assert(keys.length !== 0, `Parameter «interfaceObject» cannot have 0 properties on «ClassSkiller.addInterface»`);
  this.assert(keys.length <= 2, `Parameter «interfaceObject» cannot more than 2 properties on «ClassSkiller.addInterface»`);
  for(let index=0; index<keys.length; index++) {
    const key = keys[index];
    this.assert(["static","prototype"].includes(key), `Parameter «interfaceObject» can only have properties «static» and «prototype» but «${key}» was found instead on «ClassSkiller.addInterface»`);
  }
  if (keys.includes("static")) {
    Std.functions.mixProperties(base, interfaceObject.static);
  }
  if ((typeof base === "object") && (!base.prototype)) {
    base.prototype = {};
  }
  if (keys.includes("prototype")) {
    Std.functions.mixProperties(base.prototype || {}, interfaceObject.prototype);
  }
}