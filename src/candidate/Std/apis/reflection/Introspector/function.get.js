function get(data, key) {
  return key.reduce((output, property) => {
    return output?.[property];
  }, data);
}