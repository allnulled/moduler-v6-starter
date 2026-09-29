// @interface:TypesValidatorInterface
{
  prototype: {},
  static: {
    validateData: $compiler.inject.source("./function.validateData.js"),
    validateTypeObject: $compiler.inject.source("./function.validateTypeObject.js"),
    validateTypeArray: $compiler.inject.source("./function.validateTypeArray.js"),
    validateTypeList: $compiler.inject.source("./function.validateTypeList.js"),
    validateTypeFactory: $compiler.inject.source("./function.validateTypeFactory.js"),
    validateTypeId: $compiler.inject.source("./function.validateTypeId.js"),
    validateTypeAppendix: $compiler.inject.source("./function.validateTypeAppendix.js"),
  },
}