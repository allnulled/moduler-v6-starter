{
  default: Std.classes.ViewsRegistry.initialize("TypeNullDefaultView", {
    name: "TypeNullDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./null.view.html"),
  })
}