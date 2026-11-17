{
  default: Std.classes.ViewsRegistry.initialize("TypeStringDefaultView", {
    name: "TypeStringDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./string.view.html"),
  })
}