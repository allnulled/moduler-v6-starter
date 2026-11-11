{
  abstraction: {
    onValidate(memory) {
      return memory.localData !== null && typeof memory.localData === "object" && !Array.isArray(memory.localData);
    },
    views: $compiler.inject.source("./object.object.js")
  }
}