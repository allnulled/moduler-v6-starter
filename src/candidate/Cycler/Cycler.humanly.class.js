class Cycler {
  static get new() {
    return new this();
  }
  configure(configurations) {
    if (typeof configurations !== "object") throw new Error(`Parameter «configurations» must be object but «${typeof configurations}» was found instead on «Cycler.prototype.configure»`);
    for (let prop in configurations) this["_" + prop] = configurations[prop];
    return this;
  }
  set(data) {
    if (typeof data !== "object") throw new Error(`Parameter «data» must be object but «${typeof data}» was found instead on «Cycler.prototype.set»`);
    for (let prop in data) this["_" + prop] = data[prop];
    return this;
  }
  make(instructions, injection = false) {
    let output, outputPromise;
    let parameters, steps, hasPromises;
    Set_steps: {
      if (typeof instructions === "string") steps = [instructions];
      else if (Array.isArray(instructions)) steps = instructions;
      else if (typeof instructions === "function") steps = [instructions];
      else throw new Error(`Parameter «instructions» must be string, array or function on «Cycler.prototype.make»`);
    }
    Set_parameters: {
      if (injection === false) break Set_parameters;
      const injectionType = typeof injection;
      if (!["object", "function"].includes(injectionType)) throw new Error(`Parameter «injection» must be object or function but «${injectionType}» was found instead on «Cycler.prototype.make»`);
      if (injectionType === "object") parameters = Object.create(Object.assign({}, injection), this);
      else if (injectionType === "function") parameters = injection(this);
      else throw new Error("This error statement cannot physically happen, you probably are under some allucynogen");
    }
    DEBUG(value);
    Run_steps_with_parameters: {
      for (let index = 0; index < steps.length; index++) {
        let result;
        let value = undefined, isMethod = false;
        const step = steps[index], stepType = typeof step;
        Set_callback: {
          if (stepType === "string") {
            if(!(step in this)) throw new Error(`Parameter «instructions» is specifying step «${step}» at index «${index}» but there is no method with such name on the instance on «Cycler.prototype.make»`);
            value = this[step];
            isMethod = true;
            if(typeof value !== "function") throw new Error(`Parameter «instructions» is specifying step «${step}» at index «${index}» then property «${step}» must be function but «${typeof value}» was found instead on «Cycler.prototype.make»`);
          } else if (stepType === "function") {
            value = step;
          } else throw new Error(`Parameter «instructions» at index «${index}» must be string or function but «${typeof step}» was found instead on «Cycler.prototype.make»`);
        }
        Resolve_async_or_sync:
        if(hasPromises) {
          result = isMethod ? value.call(this, parameters) : value(parameters);
          outputPromise.then(out => {
            out.push(result);
            return out;
          });
        } else {
          result = isMethod ? value.call(this, parameters) : value(parameters);
          if(result instanceof Promise) {
            outputPromise = result.then(promisedResult => {
              output.push(promisedResult);
              return output;
            });
            hasPromises = true;
          } else {
            output.push(result);
          }
        }
      }
    }
    return outputPromise || output;
  }
}