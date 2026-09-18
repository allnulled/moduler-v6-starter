{
  // @interface:TypeNumberInterface
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        if(typeof input !== "number") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be number but «${typeof input}» was found instead at «data.${step.dataPointer.join(".")}»` });
        }
        return {"*type":"number", value:input, validated: true};
      }
    }
  },
}