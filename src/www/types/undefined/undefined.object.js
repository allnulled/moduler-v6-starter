{
  default: Std.classes.ViewsRegistry.initialize("TypeUndefinedDefaultView", {
    name: "TypeUndefinedDefaultView",
    mixins: [Std.views.TypesFormPrototype],
    template: $compiler.inject.string("./undefined.view.html"),
  })
}