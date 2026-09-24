(function () {
  Internal_api_tools: {
    Error.tools = {};
    Error.tools.settings = { prelines: 5, postlines: 5, };
    Error.tools.StackFrame = $compiler.inject.source("@/src/www/external/stacktrace.js/ErrorStackFrame.external.js");
    Error.tools.StackParser = $compiler.inject.source("@/src/www/external/stacktrace.js/ErrorStackParser.external.js");
    Error.tools.ignoredErrorFrames = [
      // Node.js:
      "node:internal/modules/cjs/loader",
      "node:internal/modules/helpers",
      // This api:
      "Error.normalize",
      "Error.adding",
      // ModulerV6/CompilerV6/DevBinaryV6:
      "async DevBinaryV6Utils.executeUnitTestFileOf",
      "async DevBinaryV6.command",
      "async DevBinaryV6Utils.touchFile",
    ];
    Error.tools.readResource = function (resource) {
      return $moduler._readPath(resource);
    };
    Error.tools.ErrorMetadata = class ErrorMetadata {
      constructor() {
        this.attachments = [];
      }
    };
    Error.tools.createPushFrameUniquelyFilter = function (frame) {
      return;
    };
    Error.tools.noopSelf = it => it;
    Error.tools.pushOnce = function (list, frame) {
      const isRepeated = list.some(function (item) {
        return frame.fileName === item.fileName
          && frame.columnNumber === item.columnNumber
          && frame.lineNumber === item.lineNumber;
      });
      if (!isRepeated) list.push(frame);
    };
    Error.tools.createFrameFilter = function (frames, ignoredFrames, ignoreds) {
      return function (frame) {
        if (ignoreds.includes(frame.fileName) || ignoreds.includes(frame.functionName)) Error.tools.pushOnce(ignoredFrames, frame);
        else Error.tools.pushOnce(frames, frame);
      };
    };
    Error.tools.getSourceFragment = function (source, line, column, prelines = 5, postlines = 5) {
      const lines = source.split(/\r?\n/);
      const lineIndex = line - 1;
      const start = Math.max(0, lineIndex - prelines);
      const end = Math.min(lines.length, lineIndex + postlines);
      const width = String(end).length;
      const output = [];
      for (let i = start; i < end; i++) {
        output.push(`${String(i + 1).padStart(width)} | ${lines[i]}`);
        if (i === lineIndex) {
          output.push(`${" ".repeat(width)} | ${" ".repeat(column - 1 - 1 - 1)}☝️`); // 👇
        }
      }
      return output.join("\n");
    };
  }
  Static_extensions: {
    Error.normalize = function (input) {
      let normalized;
      if (input instanceof Error) normalized = input;
      else if (typeof input === "string") normalized = new Error(input);
      else if (typeof input === "object") normalized = Object.assign(new Error(), input);
      else normalized = Object.assign(new Error(), { message: `(${typeof input}) ${input}` });
      if (!("metadata" in normalized)) normalized.metadata = new Error.tools.ErrorMetadata();
      return normalized;
    };
  }
  Prototype_extensions: {
    Error.prototype.adding = function (suberror) {
      Error.normalize(this);
      this.metadata.attachments.push(Error.normalize(suberror));
      return this;
    };
    Error.prototype.toObject = function (ignoreds = []) {
      Error.normalize(this);
      const ast = {};
      Headers_of_current: {
        ast.name = this.name;
        ast.message = this.message;
        ast.stack = this.stack;
      }
      const frames = [];
      const ignoredFrames = [];
      Frames_of_current: {
        Error.tools.StackParser.parse(this)
          .forEach(Error.tools.createFrameFilter(frames, ignoredFrames, Error.tools.ignoredErrorFrames.concat(ignoreds)));
      }
      Frames_of_attachments: {
        if (this.metadata.attachments.length) this.metadata.attachments
          .forEach(attachment => Error.tools.StackParser.parse(Error.normalize(attachment))
            .forEach(Error.tools.createFrameFilter(frames, ignoredFrames, Error.tools.ignoredErrorFrames.concat(ignoreds))));
      }
      ast.ignoredFrames = ignoredFrames;
      ast.frames = frames;
      return ast;
    };
    Error.prototype.toProsecution = async function (options = {}) {
      const {
        memory = {},
        format = 0,
        frameWrapper = Error.tools.noopSelf,
        fileWrapper = Error.tools.noopSelf,
        functionWrapper = Error.tools.noopSelf,
        sourceWrapper = Error.tools.noopSelf,
        codeWrapper = Error.tools.noopSelf,
        headersWrapper = Error.tools.noopSelf,
      } = options;
      const output = this.toObject();
      const { frames } = output;
      for (let index = 0; index < frames.length; index++) {
        const frame = frames[index];
        const content = memory[frame.fileName] = memory[frame.fileName] || await Error.tools.readResource(frame.fileName);
        frame.prosecution = Error.tools.getSourceFragment(content, frame.lineNumber, frame.columnNumber, Error.tools.settings.prelines, Error.tools.settings.postlines);
      }
      if (format === 0) return output;
      if (format === 1) return output.frames.map((frame, index) => {
        let output = "\n";
        output += frameWrapper(`[frame=${index}]`) + `\n`;
        output += sourceWrapper(`[source=${frame.source.trim()}]`) + `\n`;
        output += functionWrapper(`[function=${frame.functionName || "?"}]`) + `\n`;
        output += fileWrapper(`[file=${frame.fileName}:${frame.lineNumber || "?"}:${frame.columnNumber || "?"}]`) + `\n\n`;
        output += codeWrapper(frame.prosecution);
        return output;
      }).reverse().join("\n") + "\n\n" + headersWrapper(`${this.stack}`) + "\n";
    };
    Error.prototype.rethrow = function () {
      throw Error.normalize(this);
    };
  }
})();