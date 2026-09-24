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
    Error.tools.StackFrame = (function (root, factory) {
      return (globalThis.StackFrame = factory());
      /**
       *
       * @ORIGINALS:
       *
       * https://github.com/stacktracejs/stackframe
       *
       */
      ("use strict");
      // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
      /* istanbul ignore next */
      if (typeof define === "function" && define.amd) {
        define("stackframe", [], factory);
      } else if (typeof exports === "object") {
        module.exports = factory();
      } else {
        root.StackFrame = factory();
      }
    })(this, function () {
      "use strict";
      function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

      function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      }

      function _getter(p) {
        return function () {
          return this[p];
        };
      }

      var booleanProps = ["isConstructor", "isEval", "isNative", "isToplevel"];
      var numericProps = ["columnNumber", "lineNumber"];
      var stringProps = ["fileName", "functionName", "source"];
      var arrayProps = ["args"];
      var objectProps = ["evalOrigin"];

      var props = booleanProps.concat(
        numericProps,
        stringProps,
        arrayProps,
        objectProps,
      );

      function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
          if (obj[props[i]] !== undefined) {
            this["set" + _capitalize(props[i])](obj[props[i]]);
          }
        }
      }

      StackFrame.prototype = {
        getArgs: function () {
          return this.args;
        },
        setArgs: function (v) {
          if (Object.prototype.toString.call(v) !== "[object Array]") {
            throw new TypeError("Args must be an Array");
          }
          this.args = v;
        },

        getEvalOrigin: function () {
          return this.evalOrigin;
        },
        setEvalOrigin: function (v) {
          if (v instanceof StackFrame) {
            this.evalOrigin = v;
          } else if (v instanceof Object) {
            this.evalOrigin = new StackFrame(v);
          } else {
            throw new TypeError("Eval Origin must be an Object or StackFrame");
          }
        },

        toString: function () {
          var fileName = this.getFileName() || "";
          var lineNumber = this.getLineNumber() || "";
          var columnNumber = this.getColumnNumber() || "";
          var functionName = this.getFunctionName() || "";
          if (this.getIsEval()) {
            if (fileName) {
              return (
                "[eval] (" +
                fileName +
                ":" +
                lineNumber +
                ":" +
                columnNumber +
                ")"
              );
            }
            return "[eval]:" + lineNumber + ":" + columnNumber;
          }
          if (functionName) {
            return (
              functionName +
              " (" +
              fileName +
              ":" +
              lineNumber +
              ":" +
              columnNumber +
              ")"
            );
          }
          return fileName + ":" + lineNumber + ":" + columnNumber;
        },
      };

      StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf("(");
        var argsEndIndex = str.lastIndexOf(")");

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(",");
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf("@") === 0) {
          var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, "");
          var fileName = parts[1];
          var lineNumber = parts[2];
          var columnNumber = parts[3];
        }

        return new StackFrame({
          functionName: functionName,
          args: args || undefined,
          fileName: fileName,
          lineNumber: lineNumber || undefined,
          columnNumber: columnNumber || undefined,
        });
      };

      for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype["get" + _capitalize(booleanProps[i])] = _getter(
          booleanProps[i],
        );
        StackFrame.prototype["set" + _capitalize(booleanProps[i])] = (function (
          p,
        ) {
          return function (v) {
            this[p] = Boolean(v);
          };
        })(booleanProps[i]);
      }

      for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype["get" + _capitalize(numericProps[j])] = _getter(
          numericProps[j],
        );
        StackFrame.prototype["set" + _capitalize(numericProps[j])] = (function (
          p,
        ) {
          return function (v) {
            if (!_isNumber(v)) {
              throw new TypeError(p + " must be a Number");
            }
            this[p] = Number(v);
          };
        })(numericProps[j]);
      }

      for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype["get" + _capitalize(stringProps[k])] = _getter(
          stringProps[k],
        );
        StackFrame.prototype["set" + _capitalize(stringProps[k])] = (function (
          p,
        ) {
          return function (v) {
            this[p] = String(v);
          };
        })(stringProps[k]);
      }

      return StackFrame;
    });
    Error.tools.StackParser = (function (root, factory) {
      return (globalThis.ErrorStackParser = factory(globalThis.StackFrame));
      /**
       *
       * @ORIGINALS:
       *
       * https://github.com/stacktracejs/error-stack-parser
       *
       */
      ("use strict");
      // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
      /* istanbul ignore next */
      if (typeof define === "function" && define.amd) {
        define("error-stack-parser", ["stackframe"], factory);
      } else if (typeof exports === "object") {
        module.exports = factory(require("stackframe"));
      } else {
        root.ErrorStackParser = factory(root.StackFrame);
      }
    })(this, function ErrorStackParser(StackFrame) {
      "use strict";

      var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
      var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
      var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

      return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
          if (
            typeof error.stacktrace !== "undefined" ||
            typeof error["opera#sourceloc"] !== "undefined"
          ) {
            return this.parseOpera(error);
          } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
          } else if (error.stack) {
            return this.parseFFOrSafari(error);
          } else {
            throw new Error("Cannot parse given Error object");
          }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
          // Fail-fast but return locations like "(native)"
          if (urlLike.indexOf(":") === -1) {
            return [urlLike];
          }

          var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
          var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
          return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
          var filtered = error.stack.split("\n").filter(function (line) {
            return !!line.match(CHROME_IE_STACK_REGEXP);
          }, this);

          return filtered.map(function (line) {
            if (line.indexOf("(eval ") > -1) {
              // Throw away eval information until we implement stacktrace.js/stackframe#8
              line = line
                .replace(/eval code/g, "eval")
                .replace(/(\(eval at [^()]*)|(,.*$)/g, "");
            }
            var sanitizedLine = line
              .replace(/^\s+/, "")
              .replace(/\(eval code/g, "(")
              .replace(/^.*?\s+/, "");

            // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
            // case it has spaces in it, as the string is split on \s+ later on
            var location = sanitizedLine.match(/ (\(.+\)$)/);

            // remove the parenthesized location from the line, if it was matched
            sanitizedLine = location
              ? sanitizedLine.replace(location[0], "")
              : sanitizedLine;

            // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
            // because this line doesn't have function name
            var locationParts = this.extractLocation(
              location ? location[1] : sanitizedLine,
            );
            var functionName = (location && sanitizedLine) || undefined;
            var fileName =
              ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1
                ? undefined
                : locationParts[0];

            return new StackFrame({
              functionName: functionName,
              fileName: fileName,
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line,
            });
          }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
          var filtered = error.stack.split("\n").filter(function (line) {
            return !line.match(SAFARI_NATIVE_CODE_REGEXP);
          }, this);

          return filtered.map(function (line) {
            // Throw away eval information until we implement stacktrace.js/stackframe#8
            if (line.indexOf(" > eval") > -1) {
              line = line.replace(
                / line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,
                ":$1",
              );
            }

            if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
              // Safari eval frames only have function names and nothing else
              return new StackFrame({
                functionName: line,
              });
            } else {
              var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
              var matches = line.match(functionNameRegex);
              var functionName = matches && matches[1] ? matches[1] : undefined;
              var locationParts = this.extractLocation(
                line.replace(functionNameRegex, ""),
              );

              return new StackFrame({
                functionName: functionName,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line,
              });
            }
          }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
          if (
            !e.stacktrace ||
            (e.message.indexOf("\n") > -1 &&
              e.message.split("\n").length > e.stacktrace.split("\n").length)
          ) {
            return this.parseOpera9(e);
          } else if (!e.stack) {
            return this.parseOpera10(e);
          } else {
            return this.parseOpera11(e);
          }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
          var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
          var lines = e.message.split("\n");
          var result = [];

          for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
              result.push(
                new StackFrame({
                  fileName: match[2],
                  lineNumber: match[1],
                  source: lines[i],
                }),
              );
            }
          }

          return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
          var lineRE =
            /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
          var lines = e.stacktrace.split("\n");
          var result = [];

          for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
              result.push(
                new StackFrame({
                  functionName: match[3] || undefined,
                  fileName: match[2],
                  lineNumber: match[1],
                  source: lines[i],
                }),
              );
            }
          }

          return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
          var filtered = error.stack.split("\n").filter(function (line) {
            return (
              !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
              !line.match(/^Error created at/)
            );
          }, this);

          return filtered.map(function (line) {
            var tokens = line.split("@");
            var locationParts = this.extractLocation(tokens.pop());
            var functionCall = tokens.shift() || "";
            var functionName =
              functionCall
                .replace(/<anonymous function(: (\w+))?>/, "$2")
                .replace(/\([^)]*\)/g, "") || undefined;
            var argsRaw;
            if (functionCall.match(/\(([^)]*)\)/)) {
              argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1");
            }
            var args =
              argsRaw === undefined || argsRaw === "[arguments not available]"
                ? undefined
                : argsRaw.split(",");

            return new StackFrame({
              functionName: functionName,
              args: args,
              fileName: locationParts[0],
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line,
            });
          }, this);
        },
      };
    });
    Error.tools.settings = { prelines: 10, postlines: 10 };
    Error.tools.FramesFormatter = class FramesErrorFormatter {
      static create(...args) {
        return new this(...args);
      }
      static defaultPattern =
        "" +
        "[function]    %functionName\n" +
        "[frame]       %frameIndex/%framesTotal\n" +
        "[source]      %source\n" +
        "[file]        %fileName:%lineNumber:%columnNumber\n";
      static defaultJoiner = "\n";
      constructor(
        pattern = this.constructor.defaultPattern,
        joiner = this.constructor.defaultJoiner,
      ) {
        this.pattern = pattern;
        this.joiner = joiner;
      }
      format(errorObject) {
        return errorObject.frames
          .map((frame, frameIndex) => {
            return this.pattern
              .replace("%frameIndex", frameIndex + 1)
              .replace("%framesTotal", errorObject.frames.length)
              .replace("%source", frame.source.trim())
              .replace("%functionName", frame.functionName)
              .replace("%fileName", frame.fileName)
              .replace("%lineNumber", frame.lineNumber)
              .replace("%columnNumber", frame.columnNumber)
              .replace("%prosecution", frame.prosecution);
          })
          .join(this.joiner);
      }
      static globalInstance = new this();
      static format(errorObject) {
        return this.globalInstance.format(errorObject);
      }
    };
    Error.tools.ErrorListFormatter = class ErrorListFormatter {
      static defaultJoiners = { errors: "\n", frames: "\n" };
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
      static async format(
        errorList,
        errorPattern = this.constructor.defaultErrorPattern,
        framesPattern = this.constructor.defaultFramesPattern,
        joiners = this.constructor.defaultJoiners,
      ) {
        let output = "";
        for (let index = 0; index < errorList.length; index++) {
          const errorItem = errorList[index];
          const normalizedError = Error.normalize(errorItem);
          const prosecutedError = await normalizedError.toProsecution({
            format: "raw",
          });
          let headerText = "";
          headerText += `\n[!] Error: [${index + 1}/${errorList.length}]`;
          headerText += `\n    Info:  ${Error.tools.formatError(normalizedError, "%name => %message")}`;
          const headers =
            Std.objects.Ansi.style("yellow,bold").text(headerText);
          const body = Std.objects.Ansi.style("magenta").text(
            normalizedError.stack,
          );
          const footer =
            "\n" +
            Error.tools.FramesFormatter.create(
              Std.objects.Ansi.style("redBright").text(
                "\n[function]    %functionName\n[frame]       %frameIndex/%framesTotal\n[source]      %source\n[file]        %fileName:%lineNumber:%columnNumber",
              ) + Std.objects.Ansi.style("white,bold").text("\n\n%prosecution"),
            ).format(prosecutedError);
          const errorString = headers + body + footer;
          output += `${errorString}\n`;
        }
        return output;
      }
    };
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
      return $moduler
        ._readPath(Error.tools.cleanFramePrefixes(resource))
        .catch((error) => "");
    };
    Error.tools.cleanFramePrefixes = function (filename) {
      return filename ? filename.replace(/^async /g, "") : "%imposible%";
    };
    Error.tools.ErrorMetadata = class ErrorMetadata {
      constructor() {
        this.attachments = [];
      }
    };
    Error.tools.noopSelf = (it) => it;
    Error.tools.pushOnce = function (list, frame) {
      const isRepeated = list.some(function (item) {
        return (
          frame.fileName === item.fileName &&
          frame.columnNumber === item.columnNumber &&
          frame.lineNumber === item.lineNumber
        );
      });
      if (!isRepeated) list.push(frame);
    };
    Error.tools.createFrameFilter = function (frames, ignoredFrames, ignoreds) {
      return function (frame) {
        const includesFile = ignoreds.includes(
          Error.tools.cleanFramePrefixes(
            `${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`,
          ),
        );
        const includesFunction = ignoreds.includes(
          Error.tools.cleanFramePrefixes(frame.functionName),
        );
        if (includesFile || includesFunction)
          Error.tools.pushOnce(ignoredFrames, frame);
        else Error.tools.pushOnce(frames, frame);
      };
    };
    Error.tools.getSourceFragment = function (
      source,
      line,
      column,
      prelines = 5,
      postlines = 5,
    ) {
      const lines = source.split(/\r?\n/);
      const lineIndex = line - 1;
      const start = Math.max(0, lineIndex - prelines);
      const end = Math.min(lines.length, lineIndex + postlines);
      const width = String(end).length;
      const output = [];
      for (let i = start; i < end; i++) {
        output.push(`${String(i + 1).padStart(width)} | ${lines[i]}`);
        if (i === lineIndex) {
          output.push(
            `${" ".repeat(width)} | ${" ".repeat(column - 1 - 1)}☝️`.padEnd(
              100,
            ),
          ); // 👇
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
      else if (typeof input === "object")
        normalized = Object.assign(new Error(), input);
      else
        normalized = Object.assign(new Error(), {
          message: `(${typeof input}) ${input}`,
        });
      if (!("metadata" in normalized))
        normalized.metadata = new Error.tools.ErrorMetadata();
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
        Error.tools.StackParser.parse(this).forEach(
          Error.tools.createFrameFilter(
            frames,
            ignoredFrames,
            Error.tools.ignoredErrorFrames.concat(ignoreds),
          ),
        );
      }
      Frames_of_attachments: {
        if (this.metadata.attachments.length)
          this.metadata.attachments.forEach((attachment) =>
            Error.tools.StackParser.parse(Error.normalize(attachment)).forEach(
              Error.tools.createFrameFilter(
                frames,
                ignoredFrames,
                Error.tools.ignoredErrorFrames.concat(ignoreds),
              ),
            ),
          );
      }
      ast.ignoredFrames = ignoredFrames;
      ast.frames = frames;
      return ast;
    };
    Error.prototype.toProsecution = async function (optionsBrute = {}) {
      let options = optionsBrute;
      let { memory = {} } = options;
      const output = this.toObject();
      const { frames } = output;
      for (let index = 0; index < frames.length; index++) {
        const frame = frames[index];
        const content = (memory[frame.fileName] =
          memory[frame.fileName] ||
          (await Error.tools.readResource(frame.fileName)));
        frame.prosecution = Error.tools.getSourceFragment(
          content,
          frame.lineNumber,
          frame.columnNumber,
          Error.tools.settings.prelines,
          Error.tools.settings.postlines,
        );
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
        .replace("%stack", error.stack || "no stack");
    };
    Error.tools.formatErrorList = function (list, options) {
      return ErrorListFormatter.format(list, options);
    };
    Error.tools.formatFramesOf = function (...args) {
      return Error.tools.FramesFormatter.format(...args);
    };
    Error.formatList = function (errors) {
      return Std.all.JsonStringifier.stringify(
        errors,
        true,
        function (key, value) {
          if (value instanceof Error) {
            let plain = value.toObject();
            plain = Object.assign(
              {},
              { id: [plain.name, plain.message].join(" | ") },
              // {metatype: "error"},
              plain,
            );
            value.traces = plain.stack.split("\n");
            delete plain.stack;
            delete plain.ignoredFrames;
            delete plain.name;
            delete plain.message;
            plain.frames = plain.frames.map((frame) =>
              [
                frame.fileName,
                frame.lineNumber,
                frame.columnNumber,
                frame.functionName,
              ].join(" | "),
            );
            return plain;
          }
        },
      );
    };
  }
}
