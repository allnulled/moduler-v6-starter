(() => {
  
  /**@:
   * 
   * # Error native extensions
   * 
   * - Hay 3 extensiones nativas al Error:
   *    - Error.normalize(input:String|Error|Object):
   *       - crea o devuelve un error
   *       - puede usarse con String, Error u Object especificando name y message.
   *       - antes de retornarlo, normaliza el error.std.history = []
   *    - Error.throw(error:String|Error|Object):
   *       - lanza un error global estáticamente
   *    - Error.prototype.adding(error:String|Error|Object)
   *       - añade un error al error.std.history del que lo lanza
   */

  Error.normalize = function(input) {
    let error = undefined;
    if(typeof input === "string") {
      error = new Error(input);
    } else if(input instanceof Error) {
      error = input;
    } else if(typeof input === "object") {
      error = new Error(input.message || "no message specified");
      error.name = input.name || "Error";
    }
    if(!error.std) {
      error.std = [];
      error.std.history = [];
    }
    return error;
  };

  Error.prototype.adding = function(input) {
    Error.normalize(this);
    this.std.history.push(Error.normalize(input));
    return this;
  };

  Error.throw = function(error) {
    throw Error.normalize(error);
  };

})()