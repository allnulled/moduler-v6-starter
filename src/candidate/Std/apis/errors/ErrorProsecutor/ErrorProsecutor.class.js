class ErrorProsecutor {
  static async prosecute(error, memory = {}) {
    const prosecution = [];
    Std.classes.ErrorDissector.dissect(error);
    Prosecuting:
    for(let index=0; index<error.dissection.length; index++) {
      const errorFrame = error.dissection[index];
      const id = errorFrame.fileName;
      if(id in memory) continue Prosecuting;
      try {
        memory[id] = await $moduler.readPath(errorFrame.fileName);
        prosecution.push({
          resource: id,
          source: memory[id],
        });
      } catch (error) {
        memory[id] = error;
      }
    }
    error.prosecution = prosecution;
    return prosecution;
  }
  static prosecuteRecursively(error) {

  }
}