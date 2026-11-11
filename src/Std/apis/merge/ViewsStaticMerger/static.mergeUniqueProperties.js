static mergeUniqueProperties(property, value, mergedView) {
  if (!value || typeof value !== "object") return;
  if (!mergedView[property]) mergedView[property] = {};
  const target = mergedView[property];
  for (const key of Object.keys(value)) {
    $moduler.assert(!Object.prototype.hasOwnProperty.call(target, key), `Duplicated property «${property}.${key}» on «DialogsPort.methods.open»`);
    target[key] = value[key];
  }
}