/*%=mode === "async" ? "async " : ""*/function(cycle, cloneConfig = false, metaprocess = {}) {
  let output = undefined;
  let subject = this;
  let callback = undefined;
  const { isProgrammatic = false } = metaprocess;
  Resolve_subject: {
    if (cloneConfig) {
      subject = this.new.config(cloneConfig);
    }
  }
  Resolve_callback: {
    if (typeof cycle === "string") {
      if (!(cycle in subject)) throw new Error(`Parameter «cycle» when string it must be key in «this» but «${cycle}» was found instead on «RunnableInterface.prototype./*%=mode === "async" ? "runAsync " : "runSync"*/»`);
      if (typeof subject[cycle] === "function") callback = subject[cycle];
      else callback = () => this.runAsync(subject[cycle]);
    } else if (typeof cycle === "function") {
      callback = cycle;
    } else if (Array.isArray(cycle)) {
      callback = /*%=mode === "async" ? "async " : ""*/function () {
        for (let index = 0; index < cycle.length; index++) {
          const step = cycle[index];
          const result = /*%=mode === "async" ? "await " : ""*/ this./*%=mode === "async" ? "runAsync " : "runSync"*/(step, false, { isProgrammatic: true });
          if (typeof result !== "undefined") return result;
        }
      };
    } else throw new Error(`Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «RunnableInterface.prototype./*%=mode === "async" ? "runAsync " : "runSync"*/»`);
  }
  Resolve_action: {
    let error = undefined;
    try {
      if (!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunStart", [{ metaprocess }], subject);
      output = /*%=mode === "async" ? "await " : ""*/ callback.call(subject);
      if (!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunSuccess", [{ metaprocess, output }], subject);
    } catch (originalError) {
      error = Error.normalize(originalError);
      if (!isProgrammatic) error = Std.functions.triggerMethodIfExists(subject, "onRunCatch", [error, { metaprocess, output }], subject) || error;
      throw error;
    } finally {
      if (!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunEnd", [{ metaprocess, output, error }], subject);
    }
  }
  return output;
}