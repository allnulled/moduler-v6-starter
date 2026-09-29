async function validateTypeClosedArray(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeClosedArray" });
  // Std.all.Printer.debug(validator, data, step, state);
  const validation = {};
  if (validator.items.length !== data.length) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeClosedArray" });
    throw new Error(`Asimetric length on closed array between data at «${step.dataPointer.join(".") || "~"}» with «${data.length}» and validator at «${step.validatorPointer.join(".") || "~"}» with «0»`);
  }
  for (let index = 0; index < validator.items.length; index++) {
    const item = validator.items[index];
    validation[index] = await this.validateData(item, data[index], state, step.newClone.config({
      dataPointer: step.dataPointer.concat([index]),
      validatorPointer: step.validatorPointer.concat(["items", index]),
    }));
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeClosedArray" });
  return step.result = validation;
}