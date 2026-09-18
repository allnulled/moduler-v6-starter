async function validateData(validator, data, stateBrute = false, stepBrute = false) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateData" });
  let state, step;
  All_validation: {
    Step_1_Initialize: {
      state = stateBrute || Std.classes.ValidationState.new.config({ data, validator });
      step = stepBrute || Std.classes.ValidationStep.new.config({
        dataSubset: data,
        validatorSubset: validator,
      });
      Std.assert(state instanceof Std.classes.ValidationState, `Parameter «state» must be instance of «Std.classes.ValidationState» on «TypesValidatorInterface.static.validateData»`);
    }
    Step_2_Digest_validation: {
      Skip_on_optionality: {
        if ((validator.optional === true) && (typeof data === "undefined")) {
          step.result = {
            "*type": "object",
            value: data,
            validated: true,
            because: "optional value",
            fails: [Error.normalize({ name: "ValidationWarning", message: `Property «data.${step.dataPointer.join(".")}» is optional and undefined` })],
          };
          break Step_2_Digest_validation;
        }
      }
      Validate_specific_type: {
        let localError = null;
        let localValidation = {
          hasError: function() {
            return localError !== null;
          },
          getError: function() {
            return localError;
          },
          setError: function(error) {
            localError = error;
          }
        };
        try {
          if (validator.grammar === "object type") {
            await this.validateTypeObject(validator, data, step, state);
          } else if (validator.grammar === "array type") {
            await this.validateTypeArray(validator, data, step, state);
          } else if (validator.grammar === "type id") {
            await this.validateTypeId(validator, data, step, state);
          } else throw Error.normalize({ name: "ValidationError", message: `Validator contains grammar «${validator.grammar}» which is not known` });
        } catch (error) {
          localError = error;
        }
        if (validator.appendix) {
          await this.validateTypeAppendix(validator, data, step, state, localValidation);
        }
        if (localError !== null) {
          $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "TypesValidator.validateData" });
          throw localError;
        }
      }
    }
  }
  Final_step_Return: {
    Std.all.Introspector.set(state.result, step.dataPointer, step.result);
    $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateData" });
    return step.result;
  }
  /*
  --------------------------
  5 gens / 3 methods:
  {}          - validateTypeObject
  []          - validateTypeArray
  ()          - [-]
  type(__,__) - validateTypeId
  type        - validateTypeId
  1 prefix / 1 method:
  !           - applyNegation
  3 suffixes / 3 methods:
  ?           - applyOptionality
  & __        - applyLogicalAnd
  | __        - applyLogicalOr
  --------------------------
  //*/
}