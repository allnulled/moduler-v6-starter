// @interface:TypeArrayInterface
{
  prototype: { },
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeArrayInterface.static.abstraction.onValidateData"});
        if (!Array.isArray(input)) {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be array but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»` });
        }
        return { "*type": "array", value: input, validated: true };
      }
    }
  },
}