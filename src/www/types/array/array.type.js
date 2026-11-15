{
  abstraction: {
    onValidate(memory) {
      return Array.isArray(memory.localData);
    },
    views: $compiler.inject.source("./array.object.js")
  }
}