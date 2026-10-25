function initialize(data, key, value, wasInitializedValue = false) {
  let output = data;
  key.slice(0, -1).forEach(property => {
    output[property] ??= {};
    output = output[property];
  });
  const lastKey = key[key.length - 1];
  if(lastKey in output) return wasInitializedValue;
  output[lastKey] = value;
  return data;
}