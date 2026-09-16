function initialize(data, key, value) {
  let output = data;
  key.slice(0, -1).forEach(property => {
    output[property] ??= {};
    output = output[property];
  });
  const lastKey = key[key.length - 1];
  if(!(lastKey in output)) output[lastKey] = value;
  return data;
}