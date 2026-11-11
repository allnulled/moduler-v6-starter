function (title, callback) {
  return Std.classes.Tester.start(
    title,
    callback,
    this.options,
    {},
    Std.classes.Tester.new.config({
      title: title,
      options: this.options,
      parent: this,
    }),
  );
}