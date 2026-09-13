class Tracer {
  static {
    Object.assign(this, {
      create: Std.all.Creable.create,
    });
    Object.assign(this.prototype, {
      clone: Std.all.Clonable.clone,
      config: Std.all.Configurable.config,
      run: Std.all.Runnable.run,
    });
    Object.defineProperties(this, Object.getOwnPropertyDescriptors(Std.all.Newable));
  }
  /*@injects:"./prototype.isTracing.js"*/
  /*@injects:"./prototype.log.js"*/
  /*@injects:"./prototype.in.js"*/
  /*@injects:"./prototype.out.js"*/
  /*@injects:"./prototype.err.js"*/
  /*@injects:"./prototype.createSubtracer.js"*/
}