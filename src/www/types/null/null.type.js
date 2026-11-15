{
  abstraction: {
    onValidate(memory) {
      return memory.localData === null;
    },
    views: $compiler.inject.source("./null.object.js")
  }
}