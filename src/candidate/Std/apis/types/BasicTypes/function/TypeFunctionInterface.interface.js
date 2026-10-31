{
  // @interface:TypeFunctionInterface
  prototype: { },
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeFunctionInterface.static.abstraction.onValidateData"});
        if (typeof input !== "function") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be function but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»` });
        }
        return { "*type": "function", value: input, validated: true };
      }
    }
  },
}