// @interface:ClonableInterface
{
  prototype: {
    get newClone() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ClonableInterface.prototype.newClone"});
      return this.clone();
    },
    clone: function(config = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ClonableInterface.prototype.clone"});
      Validate_unclonable_properties: {
        if (this.unclonableProperties) {
          for (let index = 0; index < this.unclonableProperties.length; index++) {
            const unclonableProperty = this.unclonableProperties[index];
            if (!(unclonableProperty in config)) {
              $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", {name:"Std.interfaces.ClonableInterface.prototype.clone"});
              throw new Error(`Cannot clone without specifying property «${unclonableProperty}» on «ClonableInterface.prototype.clone»`);
            }
          }
        }
      }
      Transfer_cloned_properties: {
        if (this.clonedProperties) {
          for (let index = 0; index < this.clonedProperties.length; index++) {
            const clonedProperty = this.clonedProperties[index];
            const clonedValue = clonedProperty in config ? config[clonedProperty] : this[clonedProperty];
            config[clonedProperty] = clonedValue;
          }
        }
      }
      return this.new.config(this).config(config);
    }
  },
  static: {

  },
}