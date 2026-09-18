function validateTypeId(validator, data, step, state) {
  const TypeClass = Std.types[validator.id];
  //console.log(validator, data, step, state);
  return step.result = TypeClass.abstraction.onValidateData(data, validator, step, state);
}