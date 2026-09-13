function mixProperties(base, _propertyBuses, overridables = []) {
  const propertyBuses = Array.isArray(_propertyBuses) ? _propertyBuses : [_propertyBuses];
  Iterating_buses:
  for (let index = 0; index < propertyBuses.length; index++) {
    const bus = propertyBuses[index];
    const baseProps = Object.getOwnPropertyNames(base);
    const busProps = Object.getOwnPropertyNames(bus);
    const conflictiveNames = busProps.filter(key => baseProps.includes(key)).filter(name => !overridables.includes(name));
    if(conflictiveNames.length) throw new Error(`Trying to mix conflictive properties «${conflictiveNames.join(", ")}» on «Std.all.mixProperties»`);
    Object.defineProperties(base, Object.getOwnPropertyDescriptors(bus));
  }
  return base;
}