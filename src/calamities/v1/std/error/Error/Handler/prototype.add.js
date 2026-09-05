add(anotherError) {
  const error = typeof anotherError === "string" ? new Error(anotherError) : anotherError;
  this.constructor.normalize(this.error);
  this.error.std.history.push(error);
  return this;
}