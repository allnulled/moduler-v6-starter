async function validateTypeRepeatableArray(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeRepeatableArray" });
  // Std.all.Printer.debug(validator, data, step, state);
  const validation = {};
  let cycles = 0;
  let indexCycles = 0;
  $moduler.assert(Array.isArray(data), `Validator at «${step.validatorPointer.join(".") || "~"}» constrains «${step.dataPointer.join(".") || "~"}» to be array but «${typeof data}» was found instead on «TypesValidator.validateTypeRepeatableArray»`);
  while (indexCycles < data.length) {
    for (let index = 0; index < validator.items.length; index++) {
      indexCycles = (cycles * validator.items.length) + index;
      validation[indexCycles] = await this.validateData(validator.items[index], data[indexCycles], state, step.newClone.config({
        dataPointer: step.dataPointer.concat([indexCycles]),
        validatorPointer: step.validatorPointer.concat(["items", index]),
      }));
    }
    cycles++;
    indexCycles = (cycles * validator.items.length);
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeRepeatableArray" });
  return step.result = validation;

}