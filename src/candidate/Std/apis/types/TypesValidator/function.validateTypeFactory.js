async function validateTypeFactory(validator, data, step, state) {
  if(typeof data !== "function") {
    // Std.all.Printer.debug(validator, data, step, state);
    throw Error.normalize({
      name: "FunctionTypeValidationError",
      message: `Property at «${step.dataPointer.join(".") || "~"}» should be function to pass validator at «${step.validatorPointer.join(".") || "~"}» but «${typeof data}» was found instead`,
    });
  }
}