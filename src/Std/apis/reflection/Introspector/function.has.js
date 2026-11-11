function has(data, key) {
  return key.every(property => {
    if (data == null || !Object.prototype.hasOwnProperty.call(data, property)) {
      return false;
    }
    data = data[property];
    return true;
  });
}