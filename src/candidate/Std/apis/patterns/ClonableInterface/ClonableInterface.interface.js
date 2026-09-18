// @interface:ClonableInterface
{
  prototype: {
    get newClone() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"ClonableInterface.prototype.newClone"});
      return this.clone();
    },
    clone: function(config = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", {name:"ClonableInterface.prototype.clone"});
      Validate_unclonable_properties: {
        if (this.unclonableProperties) {
          for (let index = 0; index < this.unclonableProperties.length; index++) {
            const unclonableProperty = this.unclonableProperties[index];
            if (!(unclonableProperty in config)) {
              $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", {name:"ClonableInterface.prototype.clone"});
              throw new Error(`Cannot clone without specifying property «${unclonableProperty}» on «ClonableInterface.prototype.clone»`);
            }
          }
        }
      }
      $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", {name:"ClonableInterface.prototype.clone"});
      return this.new.config(config);
    }
  },
  static: {

  },
}