{
  abstraction: {
    onValidate(memory) {
      return Number.isInteger(memory.localData);
    },
    views: $compiler.inject.source("./integer.object.js")
  }
}