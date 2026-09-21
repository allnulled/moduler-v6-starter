class ErrorDissector {
  static StackFrame = Std.classes.ErrorStackFrame;
  static StackParser = Std.classes.ErrorStackParser;
  static dissect(error) {
    return this.StackParser.parse(Error.normalize(error));
  }
  static dissectToJsonString(error) {
    return JSON.stringify(this.dissect(error), null, 2);
  }
}