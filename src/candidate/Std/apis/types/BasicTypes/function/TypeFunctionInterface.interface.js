{
  // @interface:TypeFunctionInterface
  prototype: { },
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if (typeof input !== "function") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be function but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return { "*type": "function", value: input, validated: true };
      }
    }
  },
}