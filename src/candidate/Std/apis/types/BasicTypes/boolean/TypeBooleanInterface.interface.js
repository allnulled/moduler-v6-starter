// @interface:TypeBooleanInterface
{
  prototype: { },
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if (typeof input !== "boolean") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be boolean but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return { "*type": "boolean", value: input, validated: true };
      }
    }
  },
}