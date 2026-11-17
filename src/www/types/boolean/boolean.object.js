{
  default: Std.classes.ViewsRegistry.initialize("TypeBooleanDefaultView", {
    name: "TypeBooleanDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./boolean.view.html"),
  })
}