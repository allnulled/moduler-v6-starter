async function validateTypeArray(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeArray" });
  // Std.all.Printer.debug(validator, data, step, state);
  const validation = {};
  $moduler.assert(Array.isArray(data), `Validator at «${step.validatorPointer.join(".") || "~"}» constrains «${step.dataPointer.join(".") || "~"}» to be array but «${typeof data}» was found instead on «TypesValidator.validateTypeArray»`);
  if (validator.items.length !== data.length) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeArray" });
    throw new Error(`Asimetric length on closed array between data at «${step.dataPointer.join(".") || "~"}» with «${data.length}» and validator at «${step.validatorPointer.join(".") || "~"}» with «0»`);
  }
  for (let index = 0; index < validator.items.length; index++) {
    const item = validator.items[index];
    validation[index] = await this.validateData(item, data[index], state, step.newClone.config({
      dataPointer: step.dataPointer.concat([index]),
      validatorPointer: step.validatorPointer.concat(["items", index]),
    }));
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeArray" });
  return step.result = validation;
}