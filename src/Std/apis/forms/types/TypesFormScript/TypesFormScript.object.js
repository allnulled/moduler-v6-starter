Std.classes.ViewsRegistry.set("TypesFormScript", {
  name: "TypesFormScript",
  props: {},
  mixins: [Std.views.TypesFormPrototype],
  template: $compiler.inject.string("./TypesFormScript.view.html"),
})