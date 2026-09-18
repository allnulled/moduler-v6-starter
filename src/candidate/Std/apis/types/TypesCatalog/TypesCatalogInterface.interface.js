// @interface:TypesCatalogInterface
{
  prototype: {
    onCreate: function TypesCatalogInterface_onCreate() {
      this.all = this.constructor.createBasicTypesCatalog({});
    },
  },
  static: {
    createBasicTypesCatalog: function createBasicTypesCatalog(props = {}) {
      return Object.create(Std.objects.BasicTypes, props);
    }
  },
}