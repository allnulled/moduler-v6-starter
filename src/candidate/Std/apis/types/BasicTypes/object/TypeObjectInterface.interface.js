{
  // @interface:TypeObjectInterface
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if(typeof input !== "object") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be object but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return {"*type":"object", value:input, validated: true};
      }
    }
  },
}