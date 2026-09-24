Error_extension_v1_scope: {
  /**@:
   * 
   * # La API de Errores de Std
   * 
   * - Consiste en una extensión de la clase nativa `Error`
   *     - con propiedades estáticas
   *     - con métodos estáticos
   *     - con métodos prototipo
   *     - el constructor no se sobreescribe
   * - Utiliza ErrorStackFrame y ErrorStackParser
   *    - de https://www.stacktracejs.com/ ambos
   * - Cumple para 6 utilidades, no más:
   * ```js
   * // 1. Normalizar errores de cualquier input a Error:
   * Error.normalize("mensaje de error");
   * Error.normalize({ name: "ErrorName", message: "error message" });
   * Error.normalize(new Error("whatever"));
   * 
   * // 2. Añadir un error a otro con normalización intermedia:
   * const error = Error.normalize({name:"BaseError"})
   * error.adding({name:"AttachedError"});
   * 
   * // 3. Relanzar (o lanzar, funciona igual) un error:
   * error.adding({name:"AttachedError2"}).rethrow();
   * 
   * // 4. Pasar a objeto:
   * const data = error.toObject();
   * // Puedes extender localmente los Error.tools.ignoredErrorFrames así:
   * const data2 = error.toObject([ "async SomeClass.someMethod","/path/to/some/file.js",]);
   * 
   * // 5. Pasar a objeto con persecución de error:
   * const data = await error.toProsecution(); // sin formateos, porque si no, nos liamos
   * 
   * // 6. Formateo de error y de lista de errores:
   * Error.tools.formatError(error, "%name => %message [%stack]\n%frames");
   * Error.tools.formatErrorList(errors, "%name => %message [%stack]\n%frames", "%functionName:%lineNumber:%columnNumber");
   * ```
   * 
   * 
   * 
   */
  Internal_api_tools: {
    Error.tools = {};
    Error.tools.StackFrame = $compiler.inject.source("@/src/www/external/stacktrace.js/ErrorStackFrame.external.js");
    Error.tools.StackParser = $compiler.inject.source("@/src/www/external/stacktrace.js/ErrorStackParser.external.js");
    Error.tools.settings = { prelines: 10, postlines: 10, };
    Error.tools.FramesFormatter = $compiler.inject.source("@/src/candidate/Std/apis/errors/ErrorFormatter/ErrorFormatter.class.js");
    Error.tools.ErrorListFormatter = $compiler.inject.source("@/src/candidate/Std/apis/errors/ErrorListFormatter/ErrorListFormatter.class.js");
    Error.tools.ignoredErrorFrames = [
      // Node.js:
      "node:internal/modules/cjs/loader",
      "node:internal/fs/promises",
      "node:internal/modules/helpers",
      // This api:
      "Error.normalize",
      // "Error.adding",
      // ModulerV6/CompilerV6/DevBinaryV6:
      "DevBinaryV6Utils.executeUnitTestFileOf",
      "DevBinaryV6.command",
      "DevBinaryV6Utils.touchFile",
      "ModulerV6.import",
      "ModulerV6._importFile",
      "Tester.evaluateDirectory",
      "Tester.evaluateCallback",
      "DevBinaryV6Utils.propagateUpTouchEventFrom",
      "/home/carlos/Escritorio/Programas/moduler-v6-starter/src/external/dev-binary-v6.entry.js:1810:10",
      "/home/carlos/Escritorio/Programas/moduler-v6-starter/test/unit/src/candidate/Std/Std.test.js:19:5",
      "ErrorListFormatter.format",
      "Tester.start",
    ];
    Error.tools.readResource = function (resource) {
      return $moduler._readPath(Error.tools.cleanFramePrefixes(resource)).catch(error => "");
    };
    Error.tools.cleanFramePrefixes = function (filename) {
      return filename ? filename.replace(/^async /g, "") : "%imposible%";
    };
    Error.tools.ErrorMetadata = class ErrorMetadata {
      constructor() {
        this.attachments = [];
      }
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
        const includesFile = ignoreds.includes(Error.tools.cleanFramePrefixes(`${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`));
        const includesFunction = ignoreds.includes(Error.tools.cleanFramePrefixes(frame.functionName));
        if (includesFile || includesFunction) Error.tools.pushOnce(ignoredFrames, frame);
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
          output.push(`${" ".repeat(width)} | ${" ".repeat(column - 1 - 1)}☝️`.padEnd(100)); // 👇
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
    Error.prototype.toProsecution = async function (optionsBrute = {}) {
      let options = optionsBrute;
      let {memory = {}} = options;
      const output = this.toObject();
      const { frames } = output;
      for (let index = 0; index < frames.length; index++) {
        const frame = frames[index];
        const content = memory[frame.fileName] = memory[frame.fileName] || await Error.tools.readResource(frame.fileName);
        frame.prosecution = Error.tools.getSourceFragment(content, frame.lineNumber, frame.columnNumber, Error.tools.settings.prelines, Error.tools.settings.postlines);
      }
      return output;
    };
    Error.prototype.rethrow = function () {
      throw Error.normalize(this);
    };
  }
  Static_formatters: {
    Error.tools.formatError = function (error, template) {
      return template
        .replace("%name", error.name || "no name")
        .replace("%message", error.message || "no message")
        .replace("%stack", error.stack || "no stack")
    };
    Error.tools.formatErrorList = function(list, options) {
      return ErrorListFormatter.format(list, options);
    };
    Error.tools.formatFramesOf = function(...args) {
      return Error.tools.FramesFormatter.format(...args);
    };
    Error.formatList = function(errors) {
      return Std.all.JsonStringifier.stringify(errors, true, function(key, value) {
        if(value instanceof Error) {
          let plain = value.toObject();
          plain = Object.assign(
            {},
            {id: [plain.name, plain.message].join(" | ")},
            // {metatype: "error"},
            plain
          );
          value.traces = plain.stack.split("\n");
          delete plain.stack;
          delete plain.ignoredFrames;
          delete plain.name;
          delete plain.message;
          plain.frames = plain.frames.map(frame => [frame.fileName,frame.lineNumber,frame.columnNumber,frame.functionName].join(" | "));
          return plain;
        }
      });
    }
  }
};