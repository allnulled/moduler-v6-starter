function validateTypeId(validator, data, step, state) {
  if(!(validator.id in Std.types)) {
    console.log(validator);
    Error.normalize({ name: "TypeNotFoundError", message: `Type «${validator.id}» is not a known type` }).rethrow();
  }
  const TypeClass = Std.types[validator.id];
  //console.log(validator, data, step, state);
  return step.result = TypeClass.abstraction.onValidateData(data, validator, step, state);
}