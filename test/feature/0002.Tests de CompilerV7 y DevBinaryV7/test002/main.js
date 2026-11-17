class SomeClass {
  static prop1 = $compiler.inject.to.js.code("./static.prop1.js");
  static prop2 = $compiler.inject.to.js.code("./static.prop2.js");
  static prop3 = $compiler.inject.to.js.code("./static.prop3.js");
  static templ1 = $compiler.inject.to.js.string("./static.text1.js");
}