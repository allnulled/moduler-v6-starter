{
  // @interface:TypeStringInterface
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeStringInterface.static.abstraction.onValidateData"});
        if(typeof input !== "string") {
          throw Error.normalize({
            name: "ValidationError",
            message: `Required «input» to be string but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»`,
          });
        }
        return {
          "*type": "string",
          value:input,
          validated: true
        };
      }
    }
  },
}