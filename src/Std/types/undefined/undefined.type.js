{
  abstraction: {
    onValidate(memory) {
      return typeof memory.localData === "undefined";
    },
    views: $compiler.inject.source("./undefined.object.js")
  }
}