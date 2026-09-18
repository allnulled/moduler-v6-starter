function getAllProperties(object, stopOnPrototypes = [], ignoreJsPrototypes = true) {
  const properties = new Set();
  Iterating_properties:
  while (object) {
    for (const property of Reflect.ownKeys(object)) {
      properties.add(property);
    }
    object = Object.getPrototypeOf(object);
    if((ignoreJsPrototypes && Std.objects.NativePrototypes.includes(object)) || stopOnPrototypes.includes(object)) break Iterating_properties;
  }
  return [...properties];
}