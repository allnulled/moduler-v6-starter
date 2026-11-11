class UniqueEvent extends Array {

  constructor(name) {
    super();
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.UniqueEvent.constructor"});
    if(typeof name !== "string") throw new Error(`Parameter «name» must be stirng but «${typeof name}» was found instead on «UniqueEvent.constructor»`);
    this.eventName = name;
    this.eventParameters = null;
  }

  evaluateEventSync(parameters = {}) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.UniqueEvent.prototype.evaluateEventSync"});
    if(this.eventParameters !== null) {
      throw new Error(`Event «${this.eventName}» was already triggered on «UniqueEvent.prototype.evaluateEventSync»`);
    }
    this.eventParameters = parameters;
    for(let index=0; index<this.length; index++) {
      const trigger = this[index];
      trigger(parameters);
    }
    this.length = 0;
  }

  addTrigger(trigger) {
    $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.classes.UniqueEvent.prototype.addTrigger"});
    if(typeof trigger !== "function") throw new Error(`Parameter «trigger» must be function but «${typeof trigger}» was found instead on «UniqueEvent.prototype.addTrigger»`);
    if(this.eventParameters === null) {
      return this.push(trigger);
    }
    return trigger(this.eventParameters);
  }

}