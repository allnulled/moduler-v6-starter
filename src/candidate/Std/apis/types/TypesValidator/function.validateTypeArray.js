async function validateTypeArray(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeArray" });
  // Std.all.Printer.debug(validator, data, step, state);
  const validation = {};
  for(let index=0; index<validator.items.length; index++) {
    const item = validator.items[index];
    const subvalidation = await this.validateData(item, data[index], state, step.newClone.config({
      dataPointer: step.dataPointer.concat([index]),
      validatorPointer: step.validatorPointer.concat(["items", index]),
    }));
    validation[index] = subvalidation;
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeArray" });
  return step.result = validation;
}