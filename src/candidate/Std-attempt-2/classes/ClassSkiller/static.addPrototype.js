static addPrototype (clazz, info, overriders = []) {
  this.assert(["function","object"].includes(typeof clazz), `Parameter «clazz» must be function or object on «ClassBuilder.prototype.addPrototype»`);
  this.assert(typeof info === "object", `Parameter «info» must be object on «ClassBuilder.prototype.addPrototype»`);
  this.assert(info !== null, `Parameter «info» cannot be null on «ClassBuilder.prototype.addPrototype»`);
  const properties = Object.getOwnPropertyDescriptors(info);
  const accessors = Object.fromEntries(Object.entries(properties).filter(it => it[1].get || it[1].set));
  const members = Object.keys(Object.fromEntries(Object.entries(properties).filter(it => (!it[1].get) && (!it[1].set)))).reduce((out, it) => {
    out[it] = info[it];
    return out;
  }, {});
  Checking_static_members:
  for(const newProp in members) {
    if(overriders.includes(newProp)) continue Checking_static_members;
    this.assert(!(newProp in clazz), {name: "ForbiddenOverrideError",message: `Property «${newProp}» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addPrototype»`});
  }
  Checking_static_accessors:
  for(const newProp in accessors) {
    if(overriders.includes(newProp)) continue Checking_static_accessors;
    this.assert(!(newProp in clazz), {name: "ForbiddenOverrideError",message: `Property «${newProp}» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addPrototype»`});
  }
  Este_es_el_fix_necesario_minimo_sobreescribir_prototype_en_caso_de_objeto: {
    if(typeof clazz === "object") Object.setPrototypeOf(clazz, clazz.prototype = clazz.prototype || info.prototype || {});
  }
  Object.assign(clazz.prototype, members);
  Object.defineProperties(clazz.prototype, accessors);
}