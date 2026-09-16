// @interface:TypesValidatorInterface
{
  prototype: {},
  static: {
    validateData: $compiler.inject.source("./function.validateData.js"),
    validateEvaluableType: $compiler.inject.source("./function.validateEvaluableType.js"),
    validateTypeObject: $compiler.inject.source("./function.validateTypeObject.js"),
    validateTypeArray: $compiler.inject.source("./function.validateTypeArray.js"),
    validateTypeId: $compiler.inject.source("./function.validateTypeId.js"),
    validateTypeAppendix: $compiler.inject.source("./function.validateTypeAppendix.js"),
  },
}