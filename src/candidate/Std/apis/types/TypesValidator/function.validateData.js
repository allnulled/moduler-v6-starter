async function validateData(validatorBrute, data, stateBrute = false, stepBrute = false) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TypesValidator.validateData" });
  let validator, state, step;
  All_validation: {
    Step_0_Parse_validator_expression_if_string: {
      validator = typeof validatorBrute === "string" ? Std.classes.TypesParser.parse(validatorBrute) : validatorBrute;
      Std.assert(typeof validator === "object", { name: "BadParamError", message: `Required «validator» to be string or object but «${typeof validator}» was found instead on «TypesValidator.validateData»` });
    }
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
            fails: [Error.normalize({ name: "ValidationWarning", message: `Property «${step.dataPointer.join(".") || "~"}» is optional and undefined` })],
          };
          break Step_2_Digest_validation;
        }
      }
      let localError = null;
      let localValidation = {
        hasError: function () {
          return localError !== null;
        },
        getError: function () {
          return localError;
        },
        setError: function (error) {
          localError = error;
        }
      };
      Validate_core: {
        try {
          if (validator.grammar === "object type") {
            await this.validateTypeObject(validator, data, step, state);
          } else if (validator.grammar === "closed array type") {
            await this.validateTypeClosedArray(validator, data, step, state);
          } else if (validator.grammar === "array type") {
            await this.validateTypeArray(validator, data, step, state);
          } else if (validator.grammar === "factory type") {
            await this.validateTypeFactory(validator, data, step, state);
          } else if (validator.grammar === "type id") {
            await this.validateTypeId(validator, data, step, state);
          } else throw Error.normalize({ name: "ValidationError", message: `Validator contains grammar «${validator.grammar}» which is not known` });
        } catch (error) {
          localError = error;
        }
      }
      Validate_appendixes: {
        if (validator.appendix) {
          await this.validateTypeAppendix(validator, data, step, state, localValidation);
        }
      }
      Negate_validation_if_negation_exists: {
        if (validator.negation === "!") {
          if (localError === null) {
            localError = Error.normalize({
              name: "NegationError",
              message: `Validator is negating expression at «${step.validatorPointer.join(".") || "~"}» but data at «${step.dataPointer.join(".") || "~"}» is passing the validation instead`,
            });
          } else {
            localError = null;
          }
        }
      }
      Throw_if_errors: {
        if (localError !== null) {
          $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TypesValidator.validateData" });
          throw localError;
        }
      }
      break Step_2_Digest_validation; // porque termina aquí.
    }
    break All_validation; // porque termina aquí.
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
  []          - validateTypeClosedArray
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