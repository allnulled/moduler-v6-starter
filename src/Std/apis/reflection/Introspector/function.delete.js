function _delete(data, key) {
  let output = data;
  key.slice(0, -1).forEach(property => {
    output[property] ??= {};
    output = output[property];
  });
  const lastKey = key[key.length - 1];
  if(lastKey in output) delete output[lastKey];
  return data;
}