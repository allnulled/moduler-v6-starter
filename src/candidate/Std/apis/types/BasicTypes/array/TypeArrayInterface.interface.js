// @interface:TypeArrayInterface
{
  prototype: { },
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if (!Array.isArray(input)) {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be array but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return { "*type": "array", value: input, validated: true };
      }
    }
  },
}