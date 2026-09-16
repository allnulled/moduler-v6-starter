function set(data, key, value) {
  let output = data;
  key.slice(0, -1).forEach(property => {
    output[property] ??= {};
    output = output[property];
  });
  output[key[key.length - 1]] = value;
  return data;
}