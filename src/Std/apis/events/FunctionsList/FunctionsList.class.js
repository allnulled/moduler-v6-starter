class FunctionList extends Array {
  
  /**
   * # FunctionList extends Array
   * 
   * - La Std.classes.FunctionList es para una lista de eventos que se van a ir llamando.
   * - La FunctionList NO HACE la función de una promesa donde:
   *    - una vez llamada, los siguientes pushes se triggean al momento
   *       - para eso hay que usar Std.classes.UniqueEvent
   *    - sino la de un stack que, cuando se da un evento, es llamado todo.
   * 
   * 
   */

  addFunction(callback) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.addFunction"});
    $moduler.assert(typeof callback == "function", `Required parameter «callback» to be function on «FunctionList.prototype.addFunction»`);
    this.push(callback);
  }

  removeFunction(callback) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.removeFunction"});
    const pos = this.indexOf(callback);
    if(pos === -1) return -1;
    return this.splice(pos, 1);
  }
  
  evaluateFunctionsSync(args = []) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.evaluateFunctionsSync"});
    const outputs = [];
    for(let index=0; index<this.length; index++) {
      const callback = this[index];
      const result = callback(...args);
      outputs.push(result);
    }
    return outputs;
  }
  
  async evaluateFunctionsAsync(args = []) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.evaluateFunctionsAsync"});
    const outputs = [];
    for(let index=0; index<this.length; index++) {
      const callback = this[index];
      const result = await callback(...args);
      outputs.push(result);
    }
    return outputs;
  }

}