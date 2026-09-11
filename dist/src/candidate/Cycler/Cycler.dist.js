module.exports = $moduler.import([], function () {
  const DEBUG = console.log;
  const Newable = {
    get new() {
      return new this();
    },
  };
  return (() => {
    let Cycle;

    const Newable = {
      get new() {
        return new this();
      },
    };
    const Configurable = {
      config(props) {
        return Object.assign(this, props);
      },
    };
    const Typeable = {
      as(typeId, args = []) {
        if (typeof typeId === "function") return typeId.call(this, ...args);
        if (typeof typeId === "object") return Object.assign(this, typeId);
        if (typeof typeId === "string") {
          if (!(typeId in Cycle.all))
            throw new Error(
              `Parameter «typeId» when string it must be a known key for «Cycle.all» but «${typeId}» was found instead on «Typeable.prototype.as»`,
            );
          return this.as(Cycle.all[typeId]);
        }
        throw new Error(
          `Parameter «input» must be object, string or function but «${typeof input}» was found instead on «Typeable.prototype.as»`,
        );
      },
    };
    const RunnableSync = {
      startSync(instructions, injection = false) {
        if (!Array.isArray(instructions))
          throw new Error(
            "Parameter «instructions» must be array on «Runnable.prototype.startSync»",
          );
        for (let index = 0; index < instructions.length; index++) {
          const step = instructions[index];
          if (typeof step === "string") this[step](...(injection || []));
          else if (typeof step === "function")
            step.call(this, ...(injection || []));
          else
            throw new Error(
              `Parameter «instructions[${index}]» must be string or function on «Runnable.prototype.startSync»`,
            );
        }
      },
    };
    const RunnableSerie = {
      async startSerie(instructions, injection = false) {
        if (!Array.isArray(instructions))
          throw new Error(
            "Parameter «instructions» must be array on «Runnable.prototype.startSerie»",
          );
        for (let index = 0; index < instructions.length; index++) {
          const step = instructions[index];
          if (typeof step === "string") await this[step](...(injection || []));
          else if (typeof step === "function")
            await step.call(this, ...(injection || []));
          else
            throw new Error(
              `Parameter «instructions[${index}]» must be string or function on «Runnable.prototype.startSerie»`,
            );
        }
      },
    };
    const RunnableParallel = {
      startParallel(instructions, injection = false) {
        if (!Array.isArray(instructions))
          throw new Error(
            "Parameter «instructions» must be array on «Runnable.prototype.startParallel»",
          );
        return Promise.all(
          instructions.map((step, index) => {
            if (typeof step === "string") this[step](...(injection || []));
            else if (typeof step === "function")
              step.call(this, ...(injection || []));
            else
              throw new Error(
                `Parameter «instructions[${index}]» must be string or function on «Runnable.prototype.startParallel»`,
              );
          }),
        );
      },
    };
    const RunnableRace = {
      startRace(instructions, injection = false) {
        if (!Array.isArray(instructions))
          throw new Error(
            "Parameter «instructions» must be array on «Runnable.prototype.startRace»",
          );
        return Promise.race(
          instructions.map((step, index) => {
            if (typeof step === "string") this[step](...(injection || []));
            else if (typeof step === "function")
              step.call(this, ...(injection || []));
            else
              throw new Error(
                `Parameter «instructions[${index}]» must be string or function on «Runnable.prototype.startRace»`,
              );
          }),
        );
      },
    };
    const Runnable = Object.assign(
      {
        start(instructions, options = false, injection = false) {
          if (!!options?.serie) return this.startSerie(instructions, injection);
          else if (!!options?.parallel)
            return this.startParallel(instructions, injection);
          return this.startSync(instructions, injection);
        },
      },
      RunnableSync,
      RunnableSerie,
      RunnableParallel,
      RunnableRace,
    );
    Cycle = class Cycle {
      static {
        Object.assign(this, {});
        Object.assign(this.prototype, Configurable, Typeable, Runnable);
        Object.defineProperties(
          this,
          Object.getOwnPropertyDescriptors(Newable),
        );
      }
      static all = {};
      static find(id) {
        return this.all[id];
      }
      static register(id, value) {
        this.all[id] = value;
        return this;
      }
      static remove(id) {
        delete this.all[id];
        return this;
      }
    };

    Cycle.register("Ciclo inicial", {
      paso1: function () {
        console.log("Paso 1." + this.name);
      },
      paso2: function () {
        console.log("Paso 2." + this.name);
      },
      paso3: function () {
        console.log("Paso 3." + this.name);
      },
      mainSync() {
        this.paso1();
        this.paso2();
        this.paso3();
      },
      async main() {
        await this.paso1();
        await this.paso2();
        await this.paso3();
      },
    });
    console.log(
      Cycle.new
        .as("Ciclo inicial")
        .config({ name: "alt mainSync" })
        .startSync(["mainSync"]),
    );
    Cycle.new
      .as(Cycle.find("Ciclo inicial"))
      .config({ name: "in sync" })
      .startSync(["main"]);
    Cycle.new
      .as("Ciclo inicial")
      .config({ name: "in parallel" })
      .startParallel(["main"]);

    return Cycle;
  })();
});
