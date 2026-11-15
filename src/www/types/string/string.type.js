{
  abstraction: {
    onValidate(memory) {
      return typeof memory.localData === "string";
    },
    views: $compiler.inject.source("./string.object.js")
  }
}