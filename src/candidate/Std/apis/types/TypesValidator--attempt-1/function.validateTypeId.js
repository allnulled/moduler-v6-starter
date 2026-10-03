function validateTypeId(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeId" });
  if(!(validator.id in Std.types)) {
    console.log(validator);
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeId" });
    Error.normalize({ name: "TypeNotFoundError", message: `Type «${validator.id}» is not a known type` }).rethrow();
  }
  const TypeClass = Std.types[validator.id];
  //console.log(validator, data, step, state);
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeId" });
  return step.result = TypeClass.abstraction.onValidateData(data, validator, step, state);
}