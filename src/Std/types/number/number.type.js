{
  abstraction: {
    onValidate(memory) {
      return typeof memory.localData === "number";
    },
    views: $compiler.inject.source("./number.object.js")
  }
}