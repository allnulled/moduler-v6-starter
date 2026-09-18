{
  // @interface:TypeStringInterface
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if(typeof input !== "string") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be string but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return {"*type":"string", value:input, validated: true};
      }
    }
  },
}