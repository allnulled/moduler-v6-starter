async function validateTypeFactory(validator, data, step, state) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeFactory" });
  if (typeof data !== "function") {
    // Std.all.Printer.debug(validator, data, step, state);
    $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeFactory" });
    throw Error.normalize({
      name: "FunctionTypeValidationError",
      message: `Property at «${step.dataPointer.join(".") || "~"}» should be function to pass validator at «${step.validatorPointer.join(".") || "~"}» but «${typeof data}» was found instead`,
    });
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeFactory" });
}