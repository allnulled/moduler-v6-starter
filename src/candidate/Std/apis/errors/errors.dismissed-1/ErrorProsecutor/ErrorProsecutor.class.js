class ErrorProsecutor {

  /**
   * 
   * # Std.classes.ErrorProsecutor
   * 
   * - Esta clase no se instancia, es estática global.
   * - Disecciona y persigue errores
   * - Si no quieres acceder a la información, solo mostrarla, usa `ErrorProsecutor.printError(error:Error)`
   *    - es asíncrona, pero ya te imprime los frames del error diseccionados y filtrados
   * - Si necesitas acceder, usa `ErrorProsecutor.prosecute(error)` y el error se llenará
   * - Los resultados están en:
   *    - `Error.prototype.std.dissection` porque secciona primero
   *    - `Error.prototype.std.dissection[*].prosecution` porque lo rellena después
   * 
   */

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
        output.push(`${" ".repeat(width)} | ${" ".repeat(column-1-1)}☝️`); // 👇
      }
    }
    return output.join("\n");
  }
  
  static cleanFilename(filename) {
    return filename.replace(/^async /g, "");
  }

  static async prosecute(errorBrute, memory = {}, subindex = []) {
    const error = Std.classes.ErrorDissector.dissect(errorBrute, subindex);
    Prosecuting:
    for (let index = 0; index < error.std.dissection.length; index++) {
      const errorFrame = error.std.dissection[index];
      const id = errorFrame.fileName;
      try {
        memory[id] = await $moduler._readPath(this.cleanFilename(errorFrame.fileName));
      } catch (error) {
        memory[id] = Error.normalize(error);
        continue Prosecuting;
      }
      // Aquí se pierden los que no se han podido alcanzar:
      if(typeof memory[id] === "string") {
        error.std.dissection[index].prosecution = this.extractCodeFragmentFromStackFrame(memory[id], errorFrame);
        continue Prosecuting;
      } else {
        error.std.dissection[index].prosecution = memory[id];
      }
    }
    return error;
  }

  static async printError(errorBrute) {
    console.log("EEEEI")
    const error = await this.prosecute(errorBrute);
    console.log(error.std.dissection.map((it, index) => {
      return `[${index}]\n[=${it.functionName}]\n[@${it.fileName}]\n${it.prosecution}`;
    }).join("\n"));
  }

}