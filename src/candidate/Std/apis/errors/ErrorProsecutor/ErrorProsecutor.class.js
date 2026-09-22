class ErrorProsecutor {
  static extractCodeFragmentFromStackFrame(source, stackFrame, linesBefore = 5, linesAfter = 5) {
    return this.getSourceFragment(source, stackFrame.lineNumber, stackFrame.columnNumber, linesBefore, linesAfter);
  }
  static getSourceFragment(source, line, column, prelines = 5, postlines = 5) {
    const lines = source.split(/\r?\n/);
    const lineIndex = line - 1;
    const start = Math.max(0, lineIndex - prelines);
    const end = Math.min(lines.length, lineIndex + postlines);
    const width = String(end).length;
    const output = [];
    for (let i = start; i < end; i++) {
      output.push(`${String(i + 1).padStart(width)} | ${lines[i]}`);
      if (i === lineIndex) {
        output.push(`${" ".repeat(width)} | ${" ".repeat(column-1-1)}☝️ 🔴`); // 👇
      }
    }
    return output.join("\n");
  }
  static async prosecute(errorBrute, memory = {}) {
    const error = Std.classes.ErrorDissector.dissect(errorBrute);
    console.log("!", error);
    Prosecuting:
    for (let index = 0; index < error.std.dissection.length; index++) {
      const errorFrame = error.std.dissection[index];
      const id = errorFrame.fileName;
      try {
        memory[id] = await $moduler._readPath(errorFrame.fileName);
      } catch (error) {
        console.log(error);
        memory[id] = Error.normalize(error);
        continue Prosecuting;
      }
      console.log(memory[id]);
      // Aquí se pierden los que no se han podido alcanzar:
      if(typeof memory[id] !== "string") continue Prosecuting;
      error.std.dissection[index].prosecution = this.extractCodeFragmentFromStackFrame(memory[id], errorFrame);
    }
    return error;
  }
  static prosecuteRecursively(error) {

  }
}