static addStatic (clazz, info, overriders = []) {
  this.assert(["function","object"].includes(typeof clazz), `Parameter «clazz» must be function or object on «ClassBuilder.prototype.addStatic»`);
  this.assert(typeof info === "object", `Parameter «info» must be object on «ClassBuilder.prototype.addStatic»`);
  const properties = Object.getOwnPropertyDescriptors(info);
  const accessors = Object.fromEntries(Object.entries(properties).filter(it => it[1].get || it[1].set));
  const members = Object.keys(Object.fromEntries(Object.entries(properties).filter(it => (!it[1].get) && (!it[1].set)))).reduce((out, it) => {
    out[it] = info[it];
    return out;
  }, {});
  Checking_static_members:
  for(const newProp in members) {
    if(overriders.includes(newProp)) continue Checking_static_members;
    this.assert(!(newProp in clazz), {name: "ForbiddenOverrideError",message: `Property «${newProp}» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addStatic»`});
  }
  Checking_static_accessors:
  for(const newProp in accessors) {
    if(overriders.includes(newProp)) continue Checking_static_accessors;
    this.assert(!(newProp in clazz), {name: "ForbiddenOverrideError",message: `Property «${newProp}» cannot be overriden as accessor unless specified so in «overriders» parameter on «ClassSkiller.addStatic»`});
  }
  Object.assign(clazz, members);
  Object.defineProperties(clazz, accessors);
}