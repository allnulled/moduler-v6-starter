class Performancer {
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  onCreate() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Performancer.prototype.onCreate"});
    const d = new Date();
    this.cronometers = {
      "$": {
        started: d,
        stopped: false,
        lastUpdate: d,
      }
    };
  }
  start(id) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Performancer.prototype.start"});
    $moduler.assert(typeof id === "string", `Required property «id» to be string on «Performancer.prototype.start»`);
    $moduler.assert(!(id in this.cronometers), `Required property «id» to not exist as cronometer but «${id}» was already started on «Performancer.prototype.start»`);
    this.cronometers[id] = {
      started: new Date(),
      stopped: false,
    };
  }
  getTime() {
    const now = new Date();
    const time = now - this.cronometers.$.lastUpdate;
    this.cronometers.$.lastUpdate = now;
    return time;
  }
  stop(id) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Performancer.prototype.stop"});
    $moduler.assert(typeof id === "string", `Required property «id» to be string on «Performancer.prototype.stop»`);
    $moduler.assert(id in this.cronometers, `Required property «id» to exist as cronometer but «${id}» was not started yet on «Performancer.prototype.stop»`);
    $moduler.assert(this.cronometers[id].stopped === false, `Required cronometer «${id}}» to not be stopped already on «Performancer.prototype.stop»`);
    this.cronometers[id].stopped = new Date();
    return this.cronometers[id].total = this.cronometers[id].stopped - this.cronometers[id].started;
  }
  totalOfAll() {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Performancer.prototype.totalOfAll"});
    const output = {};
    Object.keys(this.cronometers).forEach(id => {
      output[id] = this.totalOf(id);
    });
    return output;
  }
  totalOf(id) {
    if(!(id in this.cronometers)) return 0;
    const total = this.cronometers[id].total;
    return typeof total === "number" ? total : ((new Date()) - this.cronometers[id].started);
  }
  secondsOfAll(id) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Performancer.prototype.secondsOfAll"});
    const output = {};
    Object.keys(this.cronometers).forEach(id => {
      output[id] = this.secondsOf(id);
    });
    return output;
  }
  secondsOf(id) {
    const ms = this.totalOf(id);
    if(!ms) return 0;
    if(Number.isNaN(ms)) return 0;
    if(ms === 0) return 0;
    return (ms / 1000).toFixed(3);
  }
  print(id = null) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.classes.Performancer.prototype.print"});
    if(id === null) {
      let counter = 0;
      for(let key in this.cronometers) {
        console.log(` - ${++counter}. ${key}: ${this.totalOf(key)}`);
      }
      return;
    }
    return console.log(this.totalOf(id));
  }
  static globalInstance = this.$ = Std.objects.GlobalPerformancer = Performancer.new.config({
    name: "Std.objects.GlobalPerformancer"
  });
}