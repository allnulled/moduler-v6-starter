class Checker {
  static {
    Object.assign(this, {
      create: Std.all.Creable.create,
      check: function(value) {
        return this.new.config({ value });
      },
      createCheck: function(hooks = {}) {
        return Object.assign(value => this.new.config(hooks).config({ value }), {
          that: value => this.new.config(hooks).config({ value })
        });
      }
    });
    Object.assign(this, {
      IsInterface: $compiler.inject.source("./IsInterface/IsInterface.class.js"),
      HasInterface: $compiler.inject.source("./HasInterface/HasInterface.class.js"),
      DoesInterface: $compiler.inject.source("./DoesInterface/DoesInterface.class.js"),
    });
    // Prototype prestados:
    Object.assign(this.prototype, {
      clone: Std.all.Clonable.clone,
      config: Std.all.Configurable.config,
    });
    // Prototype propios:
    Object.assign(this.prototype, {
      clarify: $compiler.inject.source("./prototype.clarify.js"),
      onCheckBefore: $compiler.inject.source("./prototype.onCheckBefore.js"),
      onCheckAfter: $compiler.inject.source("./prototype.onCheckAfter.js"),
      onCheckTrue: $compiler.inject.source("./prototype.onCheckTrue.js"),
      onCheckFalse: $compiler.inject.source("./prototype.onCheckFalse.js"),
      check: $compiler.inject.source("./prototype.check.js"),
      its: $compiler.inject.source("./prototype.its.js"),
      that: $compiler.inject.source("./prototype.that.js"),
    });
    Object.assign(this.prototype, {
      that: this.prototype.check,
    });
    Object.defineProperties(this, Object.getOwnPropertyDescriptors(Std.all.Newable));
    Object.defineProperties(this.prototype, Object.getOwnPropertyDescriptors({
      get and() {
        return this.clone();
      },
      get it() {
        return this;
      },
      get is() {
        return new this.constructor.IsInterface(this);
      },
      get has() {
        return new this.constructor.HasInterface(this);
      },
      get does() {
        return new this.constructor.DoesInterface(this);
      },
    }));
  }
}