class ErrorDissector {
  static StackFrame = Std.classes.ErrorStackFrame;
  static StackParser = Std.classes.ErrorStackParser;
  static dissect(errorBrute) {
    const error = Error.normalize(errorBrute);
    error.std.dissection = this.StackParser.parse(error);
    return error;
  }
  static dissectToJsonString(error) {
    return JSON.stringify(this.dissect(error), null, 2);
  }
}