{
  // @interface:TypeNumberInterface
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeNumberInterface.static.abstraction.onValidateData"});
        if(typeof input !== "number") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be number but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»` });
        }
        return {"*type":"number", value:input, validated: true};
      }
    }
  },
}