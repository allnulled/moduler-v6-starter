{
  abstraction: {
    onValidate(memory) {
      return typeof memory.localData === "function";
    },
    views: $compiler.inject.source("./function.object.js")
  }
}