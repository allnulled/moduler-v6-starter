{
  default: Std.classes.ViewsRegistry.initialize("TypeNumberDefaultView", {
    name: "TypeNumberDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./number.view.html"),
  })
}