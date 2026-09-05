module.exports = $moduler.import(
  ["@/dist/src/candidate/std/parser/JsonParser/JsonParser.dist.js"],
  function ([JsonParser]) {
    return class ErrorDissector {
      static get JsonParser() {
        return JsonParser;
      }
      static normalizeError(error) {
        error.std = error.std || {};
        return error;
      }
      static regexs = {
        lineStart: /^\s*at\s+(async\s+)?/,
        lineEnd: /:(\d+):(\d+)\)?\s*$/,
      };
      static getDissection(error, expanders = {}) {
        const stack = String(error.stack || "");
        const lines = stack.split("\n");
        const output = [];
        for (const line of lines) {
          const begins = line.match(this.regexs.lineStart);
          const ends = line.match(this.regexs.lineEnd);
          const info = { start: false, end: false };
          if (begins) info.start = begins[0].length;
          if (ends) info.end = line.length - ends[0].length;
          if (!(begins || ends)) continue;
          const msg = `missing:${info.start ? "" : " start"}${info.end ? "" : " end"}`;
          if (info.start && info.end) {
            const intertext = line.slice(info.start, info.end);
            const separation = intertext.indexOf("(");
            if (separation !== -1) {
              info.function = intertext.slice(0, separation).trim();
              info.file = intertext.slice(separation + 1).trim();
            } else {
              const isFile = intertext.includes(".js");
              info.function = isFile ? null : intertext;
              info.file = isFile ? intertext : null;
            }
          } else {
            info.function = msg;
            info.file = msg;
          }
          output.push({
            function: info.function,
            file: info.file,
            line: Number(ends[1]),
            column: Number(ends[2]),
            ...expanders,
          });
        }
        return output;
      }
      static getAllDissections(error) {
        const first = this.getDissection(error, { specificity: 0 });
        const output = [...first];
        const otherErrors = error.std?.history || false;
        console.log(otherErrors, "BUT STILL IN HISTORY:", error.history);
        if (otherErrors) {
          const reversedHistory = error.std.history.concat([]).reverse();
          for (let index = 0; index < reversedHistory.length; index++) {
            const otherError = reversedHistory[index];
            const otherDissection = this.getDissection(otherError, {
              specificity: index,
            });
            output.push(...otherDissection);
          }
        }
        return output;
      }
      static dissect(error) {
        this.normalizeError(error);
        error.std.dissection = this.getAllDissections(error);
        console.log(error.std);
        return error;
      }
    };
  },
);
