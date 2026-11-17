{
  default: Std.classes.ViewsRegistry.initialize("TypeDateDefaultView", {
    name: "TypeDateDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./date.view.html"),
  })
}