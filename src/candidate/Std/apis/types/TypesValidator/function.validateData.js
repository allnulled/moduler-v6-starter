async function validateData(validator, data, pointers = {}, options = {}, validationResult = false) {
  Validate_input: {
    const state = $moduler.toolkit.normalizeObject({}, {
      pointers: {
        default: {},
        validate: it => {
          if(typeof it !== "object") throw new Error("Must be object");
        },
        format: it => {
          if(!it.inData) it.inData = [];
          if(!it.inValidator) it.inValidator = [];
          return it;
        }
      }
    });
    console.log(state);
    Std.assert(typeof validator.grammar === "string", `Parameter «validator» must have property «grammar» as string on «AsserterInterface.static.validateData»`);
  }
  Step_1_Initialize_pointers: {
    const hasInData = Std.classes.Introspector.has(pointers, ["inData"]);
    const hasInValidator = Std.classes.Introspector.has(pointers, ["inValidator"]);
    if(!hasInData) Std.classes.Introspector.initialize(pointers, ["inData"], []);
    if(!hasInValidator) Std.classes.Introspector.initialize(pointers, ["inValidator"], []);
  }
  let result;
  Step_2_Initialize_result: {
    result = validationResult || Std.classes.ValidationResult.new.config({ data, validator });
    Std.assert(result instanceof Std.classes.ValidationResult, `Parameter «validationResult» must be instance of «Std.classes.ValidationResult» on «AsserterInterface.static.validateData»`);
  }
  Step_3_Digest_validation: {
    if (validator.grammar === "evaluable type") {
      this.validateEvaluableType(validator, data, { pointers, options, result });
    } else if (validator.grammar === "object type") {
      this.validateTypeObject(validator, data, { pointers, options, result });
    } else if (validator.grammar === "array type") {
      this.validateTypeArray(validator, data, { pointers, options, result });
    } else if (validator.grammar === "type id") {
      this.validateTypeId(validator, data, { pointers, options, result });
    } else if (validator.grammar === "type appendix") {
      this.validateTypeAppendix(validator, data, { pointers, options, result });
    } else throw Error.create({ name: "ValidationError", message: `Validator contains grammar «${validator.grammar}» which is not known` });
  }
  Final_step_Return: {
    return result;
  }

  /*

  --------------------------

  5 gens / 3 methods:
  {}          - validateTypeObject
  []          - validateTypeArray
  ()          - [-]
  type(__,__) - validateEvaluableType
  type        - validateEvaluableType

  1 prefix / 1 method:
  !           - applyNegation

  3 suffixes / 3 methods:
  ?           - applyOptionality
  & __        - applyLogicalAnd
  | __        - applyLogicalOr

  --------------------------

  //*/
}