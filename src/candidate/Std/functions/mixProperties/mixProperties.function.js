function mixProperties(base, _propertyBuses) {
  const propertyBuses = Array.isArray(_propertyBuses) ? _propertyBuses : [_propertyBuses];
  for (let index = 0; index < propertyBuses.length; index++) {
    const bus = propertyBuses[index];
    Object.defineProperties(base, Object.getOwnPropertyDescriptors(bus));
  }
  return base;
}