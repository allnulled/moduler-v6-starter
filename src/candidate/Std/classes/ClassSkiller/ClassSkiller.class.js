class ClassBuilder {
  static {
    Object.assign(this, {
      create: Std.all.Creable.create,
      assert: Std.functions.simplestAssert,
    });
    Object.assign(this.prototype, {
      config: Std.all.Configurable.config,
    });
    Object.defineProperties(this, Object.getOwnPropertyDescriptors(Std.all.Newable));
  }
  /*@injects:"./static.filters.js"*/
  /*@injects:"./static.getDescriptors.js"*/
  /*@injects:"./static.addStatic.js"*/
  /*@injects:"./static.addPrototype.js"*/
  /*@injects:"./static.addInterface.js"*/
}