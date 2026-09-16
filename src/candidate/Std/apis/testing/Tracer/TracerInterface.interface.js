// @interface:TracerInterface
{
  prototype: {
    isTracing: false,
    parentTracer: null,
    level: null,
    onTraceMessageFormat(operation, method, args = []) {
      let id = this.id || "";
      if(id) id = `[${id}] `;
      return `${id}[${" ".repeat(this.level + (operation === "out" ? -1 : 0))}${operation==="in"?">":operation==="out"?"<":operation==="log"?"=":"!"}] ${method}`;
    },
    onTraceArgumentsFormat: function(args, message) {
      let output = "";
      output += `${message}`.padEnd(50, " ");
      output += args.length ? ` with 0-${args.length-1}:` : "";
      output += Array.from(args).map((arg, index) => {
        let part = "";
        part += ` @${index}`;
        if(typeof arg === "string") {
          if(args.length && arg.length < 25) {
            part += ` ${JSON.stringify(arg)}`;
          } else if(arg.length) {
            part += ` ${typeof arg}`;
            part += ` [length:${arg.length}]`;
          } else {
            part += ` ""`;
          }
        } else if(Array.isArray(arg)) {
          if(arg.length) {
            part += ` [${arg.length}`;
            if(arg.length < 20) {
              part += `=${arg.map(row => typeof row).join(",")}`;
            }
            part += `]`;
          } else {
            part += ` []`;
          }
        } else if(typeof arg === "object") {
          part += ``;
          const keys = Object.keys(arg);
          if(keys.length && keys.length < 10) {
            part += ` object [keys=${keys.join(",")}]`;
          } else if(keys.length) {
            part += ` object [keys:${keys.length}]`;
          } else {
            part += ` {}`;
          }
        } else if(typeof arg === "number") {
          part += ` ${arg}`;
        } else if(typeof arg === "boolean") {
          part += ` ${arg}`;
        }
        return part;
      }).join(" |");
      return output;
    },
    log: function(method, args = []) {
      if(!this.isTracing) return false;
      const message = this.onTraceMessageFormat("log", method, args);
      Std.all.Ansi.style("blackBright").print(this.onTraceArgumentsFormat(args, message));
    },
    in: function(method, args = []) {
      if(!this.isTracing) return false;
      const message = this.onTraceMessageFormat("in", method, args);
      this.level = this.level || 0;
      this.level++;
      Std.all.Ansi.style("cyan").print(this.onTraceArgumentsFormat(args, message));
    },
    out: function(method, args = []) {
      if(!this.isTracing) return false;
      const message = this.onTraceMessageFormat("out", method, args);
      this.level = this.level || 0;
      this.level--;
      Std.all.Ansi.style("blackBright").print(this.onTraceArgumentsFormat(args, message));
    },
    error: function(method, args = []) {
      // if(!this.isTracing) return false;
      const message = this.onTraceMessageFormat("error", method, args);
      this.level = this.level || 0;
      this.level--;
      Std.all.Ansi.style("red,bold").print(this.onTraceArgumentsFormat(args, message));
    },
  },
  static: {},
}