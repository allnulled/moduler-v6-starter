(() => {
  
  /**@:
   * 
   * # Error native extensions
   * 
   * - Hay algunas extensiones nativas al Error:
   *    - Error.normalize(input:String|Error|Object):
   *       - crea o devuelve un error
   *       - puede usarse con String, Error u Object especificando name y message.
   *       - antes de retornarlo, normaliza el error.std.history = []
   *    - Error.prototype.adding(error:String|Error|Object)
   *       - añade un error al error.std.history del que lo lanza
   *    - Error.prototype.unified(subindex:[String])
   *       - devuelve un error unificando todos los suberrores
   *    - Error.prototype.prosecuted()
   *       - devuelve una Promise con la ErrorProsecution del error 
   */

  Error.tool = {
    StackParser: Std.classes.ErrorStackParser,
    StackFrame: Std.classes.ErrorStackFrame,
    Dissector: Std.classes.ErrorDissector,
    Prosecutor: Std.classes.ErrorProsecutor,
  };

  Error.normalize = function(input) {
    let error = undefined;
    if(typeof input === "string") {
      error = new Error(input);
    } else if(input instanceof Error) {
      error = input;
    } else if(typeof input === "object") {
      error = new Error(input.message || "as object with no message specified");
      error.name = input.name || "Error";
    } else {
      error = new Error(`as ${typeof input} with no message specified`);
      error.name = "Error";
    }
    if(!error.std) {
      error.std = [];
      error.std.history = [];
      error.std.dissection = null;
    }
    return error;
  };

  Error.prototype.adding = function(...inputs) {
    Error.normalize(this);
    for(let index=0; index<inputs.length; index++) {
      const input = inputs[index];
      this.std.history.push(Error.normalize(input));
    }
    return this;
  };

  Error.prototype.unified = function(subindex = []) {
    const error = new Error();
    error.name = this.name;
    error.message = Std.all.ErrorUtils.stringifyError(this, subindex);
    error.stack = this.stack;
    return error;
  };

  Error.prototype.prosecuted = function() {
    return Std.classes.ErrorProsecutor.prosecute(this);
  };

})()