// @interface:TypesCatalogInterface
{
  prototype: {
    onCreate: function TypesCatalogInterface_onCreate() {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypesCatalogInterface.prototype.onCreate"});
      this.all = this.constructor.createBasicTypesCatalog({});
    },
  },
  static: {
    createBasicTypesCatalog: function createBasicTypesCatalog(props = {}) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypesCatalogInterface.static.createBasicTypesCatalog"});
      return Object.create(Std.objects.BasicTypes, props);
    }
  },
}