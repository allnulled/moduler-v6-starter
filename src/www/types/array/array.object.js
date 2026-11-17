{
  default: Std.classes.ViewsRegistry.initialize("TypeArrayDefaultView", {
    name: "TypeArrayDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./array.view.html"),
  })
}