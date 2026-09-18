// @interface:TypeNullInterface
{
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if (input !== null) {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be null but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return { "*type": "null", value: input, validated: true };
      }
    }
  },
}