class FramesErrorFormatter {
  static create(...args) {
    return new this(...args);
  }
  static defaultPattern = "" +
    "[function]    %functionName\n" +
    "[frame]       %frameIndex/%framesTotal\n" +
    "[source]      %source\n" +
    "[file]        %fileName:%lineNumber:%columnNumber\n";
  static defaultJoiner = "\n";
  constructor(pattern = this.constructor.defaultPattern, joiner = this.constructor.defaultJoiner) {
    this.pattern = pattern;
    this.joiner = joiner;
  }
  format(errorObject) {
    throw new Error("Dont use this, use Error.prototype.toObject + custom modifier instead");
    return errorObject.frames.map((frame, frameIndex) => {
      return this.pattern
        .replace("%frameIndex", frameIndex + 1)
        .replace("%framesTotal", errorObject.frames.length)
        .replace("%source", frame.source.trim())
        .replace("%functionName", frame.functionName)
        .replace("%fileName", frame.fileName)
        .replace("%lineNumber", frame.lineNumber)
        .replace("%columnNumber", frame.columnNumber)
        .replace("%prosecution", frame.prosecution);
    }).join(this.joiner);
  }
  static globalInstance = new this();
  static format(errorObject) {
    return this.globalInstance.format(errorObject);
  }
}