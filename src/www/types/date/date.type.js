{
  abstraction: {
    onValidate(memory) {
      return memory.localData instanceof Date;
    },
    views: $compiler.inject.source("./date.object.js")
  }
}