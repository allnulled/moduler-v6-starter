(() => {
  
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