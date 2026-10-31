{
  // @interface:TypeObjectInterface
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeObjectInterface.static.abstraction.onValidateData"});
        if(typeof input !== "object") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be object but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»` });
        }
        return {"*type":"object", value:input, validated: true};
      }
    }
  },
}