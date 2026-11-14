Std.classes.ViewsRegistry.set("TypeExpressionControl", {
  name: "TypeExpressionControl",
  props: {},
  template: $compiler.inject.string("./TypeExpressionControl.view.html"),
  created() {
    throw new Error("De momento evitaremos este componente también, quizá más adelante lo implementaremos con un render apuntando a TypesFormNode")
  }
})