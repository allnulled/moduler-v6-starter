async function validateTypeAppendix(validator, data, step, state, localValidation) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateTypeAppendix" });
  let output = step.result ? [step.result] : [];
  // await Std.all.Printer.ask("Entramos en validateData", localValidation, output);
  Decide_logical_and_or_concatenation_final_result: {
    Si_ya_venia_acertando_limpiamos: {
      if ((validator.appendix?.[0].operator === "|") && (localValidation.getError() === null)) {
        // console.log("Ha pasado | porque venía limpia de antes");
        localValidation.setError(null);
        break Decide_logical_and_or_concatenation_final_result;
      }
    }
    Iterating_appendix:
    for (let indexAppendment = 0; indexAppendment < validator.appendix.length; indexAppendment++) {
      const subvalidator = validator.appendix[indexAppendment];
      const { operator, complement } = subvalidator;
      let result = undefined;
      if (operator === "|") {
        try {
          result = await this.validateData(subvalidator.complement, data, state, step.newClone.config({
            dataPointer: step.dataPointer.concat([]),
            validatorPointer: step.validatorPointer.concat(["appendix", indexAppendment, "complement"]),
          }));
          Si_pasa_lo_limpiamos_y_devolvemos: {
            // console.log("Ha pasado |");
            output.push(result);
            localValidation.setError(null);
            break Iterating_appendix;
          }
        } catch (error) {
          // console.log("Ha fallado |");
          output.push(error);
          localValidation.setError(Error.normalize(error).adding(localValidation.getError()).adding({ name: "ValidationError", message: "Failed «|» operation" }));
        }
      } else if (operator === "&") {
        Si_tenia_un_error_lo_lanzamos: {
          if (localValidation.getError() !== null) {
            $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "TypesValidator.validateTypeAppendix" });
            throw Error.normalize(localValidation.getError()).adding({ name: "ValidationError", message: `Logical «${operator}» appendix at index «${indexAppendment}» is not accomplished` });
          }
        }
        try {
          result = await this.validateData(subvalidator.complement, data, state, step.newClone.config({
            dataPointer: step.dataPointer.concat([]),
            validatorPointer: step.validatorPointer.concat(["appendix", indexAppendment, "complement"]),
          }));
          output.push(result);
          // console.log("Ha pasado &");
        } catch (error) {
          // console.log("Ha fallado &");
          output.push(error);
          localValidation.setError(Error.normalize(error).adding(localValidation.getError()).adding({ name: "ValidationError", message: "Failed «&» operation" }));
        }
      }
    }
  }
  // await Std.all.Printer.ask("Salimos de validateData", localValidation, output);
  if (localValidation.getError() !== null) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "TypesValidator.validateTypeAppendix" });
    throw localValidation.getError();
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateTypeAppendix" });
  return step.result = output;
}