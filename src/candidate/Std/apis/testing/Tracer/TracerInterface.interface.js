// @interface:TracerInterface
{
  prototype: {
    isTracing: false,
    parentTracer: null,
    level: null,
    onCreate() {
      Object.assign(this, {
        totalCalls: 0,
        shoutersByString: [
          //"CreableInterf"
        ],
        silencersByString: [
          "Performancer.",
        ],
      });
    },
    cronometer: Std.classes.Performancer.create(),
    onTraceMessageFormat(operation, method, args = []) {
      let id = this.id || "";
      const levelMark = this.level || 0; // `${this.level || 0}`.padStart(2,"0") || 0; // " ".repeat(Math.max(0, this.level + (operation === "out" ? -1 : 0)));
      if(id) id = `[${id}]`;
      let output = "";
      output += `${id}`;
      output += ` [${this.totalCalls}]`;
      output += ` [${levelMark}]`;
      output += ` [${(operation==="in")?">":(operation==="out")?"<":(operation==="log")?"·":"!"}]`;
      output += ` [⏱️${Std.classes.Performancer.$.secondsOf("$")}s|+${this.cronometer.getTime()}ms]`;
      output += ` ${method.replace(/^Std\.(classes|functions|objects|views|interfaces)\./g,"")}`;
      return output;
    },
    onTraceArgumentsFormat: function(args, message) {
      let output = "";
      output += `${message}`.padEnd(50, " ");
      output += args.length ? ` with 0-${args.length-1}:` : "";
      output += Array.from(args).map((arg, index) => {
        let part = "";
        part += ` @arguments[${index}]`;
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
              part += `:${arg.map(row => typeof row).join(",")}`;
            }
            part += `]`;
          } else {
            part += ` []`;
          }
        } else if((typeof arg === "object") && (arg !== null)) {
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
      if(!this.shouldBeTraced(method, args)) return false;
      const message = this.onTraceMessageFormat("log", method, args);
      this.totalCalls++;
      Std.all.Ansi.style("blackBright").print(this.onTraceArgumentsFormat(args, message));
    },
    in: function(method, args = []) {
      if(!this.shouldBeTraced(method, args)) return false;
      const message = this.onTraceMessageFormat("in", method, args);
      this.level = this.level || 0;
      this.level++;
      this.totalCalls++;
      Std.all.Ansi.style("cyanBright").print(this.onTraceArgumentsFormat(args, message));
    },
    out: function(method, args = []) {
      if(!this.shouldBeTraced(method, args)) return false;
      const message = this.onTraceMessageFormat("out", method, args);
      this.level = this.level || 0;
      this.level--;
      this.totalCalls++;
      Std.all.Ansi.style("blackBright").print(this.onTraceArgumentsFormat(args, message));
    },
    error: function(method, args = []) {
      // if(!this.isTracing) return false;
      const message = this.onTraceMessageFormat("error", method, args);
      this.level = this.level || 0;
      this.level--;
      this.totalCalls++;
      Std.all.Ansi.style("red,bold").print(this.onTraceArgumentsFormat(args, message));
    },
    shouldBeTraced: function(method, args) {
      Si_no_esta_traceando_no:
      if(!this.isTracing) {
        return false;
      }
      Si_tiene_gritadores_entonces_si_matchea_alguno_si_y_si_no_no: 
      if(this.hasShouters()) {
        return this.matchesShouter(method, args);
      }
      Si_matchea_algun_silenciador_no: 
      if(this.matchesSilencer(method, args)) {
        return false;
      }
      return true;
    },
    hasShouters: function() {
      return this.shoutersByString.length;
    },
    matchesSilencer: function(method, args) {
      for(let index=0; index<this.silencersByString.length; index++) {
        const silencerByString = this.silencersByString[index];
        if(method.includes(silencerByString)) {
          return true;
        }
      }
      return false;
    },
    matchesShouter: function(method, args) {
      for(let index=0; index<this.shoutersByString.length; index++) {
        const shouterByString = this.shoutersByString[index];
        if(method.includes(shouterByString)) {
          return true;
        }
      }
      return false;
    },
  },
  static: {},
}