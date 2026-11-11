function assert(condition, message = "assertion error (no details specified)") {
  /**@:
   * 
   * # Std.assert
   * 
   * - Acepta:
   *    - condition:boolean
   *    - message:string|object|error|any
   * 
   */
  if(!condition) throw Error.normalize(message).adding({name: "AssertionError", message: "Some assertion failed" });
}