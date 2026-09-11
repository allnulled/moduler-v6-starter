function createIsolationCatcher(message, scope = false) {
  return function(errorBrute) {
    const error = Error.create(errorBrute);
    throw error.adding(Std.all.renderSimpleTemplate(message, scope || this));
  }
}