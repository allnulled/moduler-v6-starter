class Process extends Std.all.Isolation {
  static {
    Object.assign(this, {
      // create: Std.all.Creable.create,
      // catcher: Std.all.createIsolationCatcher,
    });
    Object.assign(this.prototype, {
      // clone: Std.all.Clonable.clone,
      // config: Std.all.Configurable.config,
      // run: Std.all.Runnable.run,
    });
    Object.defineProperties(this, Object.getOwnPropertyDescriptors({}));
    Object.defineProperties(this.prototype, Object.getOwnPropertyDescriptors(Std.all.NewSubprocessable));
    Object.defineProperties(this.prototype, Object.getOwnPropertyDescriptors(Std.all.Pidable));
  }
  createSubprocess = $compiler.inject.source("./prototype.createSubprocess.js");
}