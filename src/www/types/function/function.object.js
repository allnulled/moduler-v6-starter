{
  default: Std.classes.ViewsRegistry.initialize("TypeFunctionDefaultView", {
    name: "TypeFunctionDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./function.view.html"),
  })
}