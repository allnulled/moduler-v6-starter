{
  default: Std.classes.ViewsRegistry.initialize("TypeObjectDefaultView", {
    name: "TypeObjectDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./object.view.html"),
  })
}