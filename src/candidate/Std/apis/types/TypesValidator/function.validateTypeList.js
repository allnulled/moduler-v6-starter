async function validateTypeList(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeList" });
  // Std.all.Printer.debug(validator, data, step, state);
  const validation = {};
  for(let index=0; index<data.length; index++) {
    validation[index] = await this.validateData(validator.item, data[index], state, step.newClone.config({
      dataPointer: step.dataPointer.concat([index]),
      validatorPointer: step.validatorPointer.concat(["item"]),
    }));
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeList" });
  return step.result = validation;
}