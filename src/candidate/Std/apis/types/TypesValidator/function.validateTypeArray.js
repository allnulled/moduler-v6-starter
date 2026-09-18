async function validateTypeArray(validator, data, step, state) {
  Std.all.Printer.debug(validator, data, step, state);
  const validation = {};
  for(let index=0; index<validator.length; index++) {
    const item = validator[index];
    const subvalidation = await this.validateData(item, data[index], state, step.newClone.config({
      dataPointer: step.dataPointer.concat([index]),
      validatorPointer: step.validatorPointer.concat([index]),
    }));
    validation[index] = subvalidation;
  }
  return step.result = validation;
}