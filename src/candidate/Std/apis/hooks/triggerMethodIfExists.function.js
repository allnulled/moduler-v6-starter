function triggerMethodIfExists(base, method, args = [], scope = false) {
  /**@:
   * 
   * # Std.functions.triggerMethodIfExists
   * 
   * - Útil para unilinear hooks de clase.
   * - Recibe:
   *    - base:object|function|any - objeto del método a triggear
   *    - method:string - nombre del método a usar
   *    - args?:array - parámetros que pasarle
   *    - scope?:any - scope al que bindear
   * 
   */
  $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.functions.triggerMethodIfExists"});
  let output = undefined;
  if(base && (typeof base[method] === "function")) {
    if(scope) {
      const output = base[method].call(scope, ...args);
      return output;
    }
    output = base[method](...args);
  }
  return output;
}