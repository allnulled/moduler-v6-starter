{
  abstraction: {
    onValidate(memory) {
      return typeof memory.localData === "boolean";
    },
    views: $compiler.inject.source("./boolean.object.js")
  }
}