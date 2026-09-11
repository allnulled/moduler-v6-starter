{
  startSync(instructions, injection = false) {
    if (!Array.isArray(instructions)) throw new Error("Parameter «instructions» must be array on «Runnable.prototype.startSync»");
    for (let index = 0; index < instructions.length; index++) {
      const step = instructions[index];
      if (typeof step === "string") this[step](...(injection || []));
      else if (typeof step === "function") step.call(this, ...(injection || []));
      else throw new Error(`Parameter «instructions[${index}]» must be string or function on «Runnable.prototype.startSync»`);
    }
  },
}