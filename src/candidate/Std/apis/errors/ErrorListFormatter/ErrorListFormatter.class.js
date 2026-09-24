class ErrorListFormatter {
  static defaultJoiners = {errors:"\n",frames:"\n"};
  static defaultErrorPattern = `
[!] Error: %errorIndex/%totalErrors
    Info:  %name => %message
    %stack\n%frames
`;
  static defaultFramesPattern = `[function]    %functionName
[frame]       %frameIndex/%framesTotal
[source]      %source
[file]        %fileName:%lineNumber:%columnNumber

%prosecution`;
  static async format(errorList, errorPattern = this.constructor.defaultErrorPattern, framesPattern = this.constructor.defaultFramesPattern, joiners = this.constructor.defaultJoiners) {
    throw new Error("Dont use ErrorListFormatter anymore, use Error.formatList instead");
    let output = "";
    for(let index=0; index<errorList.length; index++) {
      const errorItem = errorList[index];
      const normalizedError = Error.normalize(errorItem);
      const prosecutedError = await normalizedError.toProsecution({ format: "raw" });
      let headerText = "";
      headerText += `\n[!] Error: [${index + 1}/${errorList.length}]`;
      headerText += `\n    Info:  ${Error.tools.formatError(normalizedError, "%name => %message")}`;
      const headers = Std.objects.Ansi.style("yellow,bold").text(headerText);
      const body = Std.objects.Ansi.style("magenta").text(normalizedError.stack);
      const footer = "\n" + Error.tools.FramesFormatter.create(
        Std.objects.Ansi.style("redBright").text("\n[function]    %functionName\n[frame]       %frameIndex/%framesTotal\n[source]      %source\n[file]        %fileName:%lineNumber:%columnNumber") +
        Std.objects.Ansi.style("white,bold").text("\n\n%prosecution")
      ).format(prosecutedError);
      const errorString = headers + body + footer;
      output += `${errorString}\n`;
    }
    return output;
  }
}