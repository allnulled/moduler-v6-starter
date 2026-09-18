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
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", {name:"Std.functions.triggerMethodIfExists"});
  let output = undefined;
  if(base && (typeof base[method] === "function")) {
    if(scope) return base[method].call(scope, ...args);
    output = base[method](...args);
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", {name:"Std.functions.triggerMethodIfExists"});
  return output;
}