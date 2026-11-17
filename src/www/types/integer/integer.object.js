{
  default: Std.classes.ViewsRegistry.initialize("TypeIntegerDefaultView", {
    name: "TypeIntegerDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./integer.view.html"),
  })
}