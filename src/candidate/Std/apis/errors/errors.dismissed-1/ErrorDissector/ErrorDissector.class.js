class ErrorDissector {

  static StackFrame = Std.classes.ErrorStackFrame;
  
  static StackParser = Std.classes.ErrorStackParser;
  
  static dissect(errorBrute, subindex = [], errorIgnorer = Std.classes.ErrorIgnorer.globally) {
    const error = Error.normalize(errorBrute);
    Dissect_error: {
      error.std.dissection = this.StackParser.parse(error);
    }
    Dissect_error_history: {
      for(let index=0; index<error.std.history.length; index++) {
        const suberror = error.std.history[index];
        this.dissect(suberror, subindex.concat([ index ]));
        error.std.dissection = error.std.dissection.concat(suberror.std.dissection.map(diss => {
          return Object.assign(diss, {
            suberrorIndex: subindex.concat([ index ]),
          })
        }));
      }
    }
    Ignore_errors: {
      for(let indexIgnorer=0; indexIgnorer<errorIgnorer.ignorers.length; indexIgnorer++) {
        const ignorer = errorIgnorer.ignorers[indexIgnorer];
        const dissections = error.std.dissection;
        for(let indexDissected=dissections.length-1; indexDissected>=0; indexDissected--) {
          const dissection = error.std.dissection[indexDissected];
          if(typeof ignorer === "string") {
            if(dissection.functionName === ignorer) {
              dissections.splice(indexDissected, 1);
            } else if(dissection.fileName === ignorer) {
              dissections.splice(indexDissected, 1);
            }
          } else if (typeof ignorer === "function") {
            if(ignorer(dissection)) {
              dissections.splice(indexDissected, 1);
            }
          }
        }
      }
    }
    return error;
  }
  
  static dissectToJsonString(error) {
    return JSON.stringify(this.dissect(error), null, 2);
  }

}