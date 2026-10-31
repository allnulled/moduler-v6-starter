// @interface:TypeBooleanInterface
{
  prototype: { },
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeBooleanInterface.static.abstraction.onValidateData"});
        if (typeof input !== "boolean") {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be boolean but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»` });
        }
        return { "*type": "boolean", value: input, validated: true };
      }
    }
  },
}