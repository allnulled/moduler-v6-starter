class FunctionList extends Array {
  addFunction(callback) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.addFunction"});
    $moduler.assert(typeof callback == "function", `Required parameter «callback» to be function on «FunctionList.prototype.addFunction»`);
    this.push(callback);
  }
  evaluateFunctionsSync(args = []) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.evaluateFunctionsSync"});
    const outputs = [];
    for(let index=0; index<this.length; index++) {
      const callback = this[index];
      const result = callback(...args);
      outputs.push(result);
    }
    return outputs;
  }
  async evaluateFunctionsAsync(args = []) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.FunctionsList.prototype.evaluateFunctionsAsync"});
    const outputs = [];
    for(let index=0; index<this.length; index++) {
      const callback = this[index];
      const result = await callback(...args);
      outputs.push(result);
    }
    return outputs;
  }
}