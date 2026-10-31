// @interface:TypeNullInterface
{
  prototype: {},
  static: {
    abstraction: {
      onValidateData(input, validator, step, state) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.TypeNullInterface.static.abstraction.onValidateData"});
        if (input !== null) {
          throw Error.normalize({ name: "ValidationError", message: `Required «input» to be null but «${typeof input}» was found instead at «${step.dataPointer.join(".") || "~"}»` });
        }
        return { "*type": "null", value: input, validated: true };
      }
    }
  },
}