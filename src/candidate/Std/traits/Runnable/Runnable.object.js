{
  runAsync: async function(cycle, cloneConfig = false, metaprocess = {}) {
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
        if (!(cycle in subject)) throw new Error(`Parameter «cycle» must be key in «subject» but «${cycle}» was found instead on «Runnable.runSync»`);
        callback = subject[cycle];
      } else if (typeof cycle === "function") {
        callback = cycle;
      } else if (Array.isArray(cycle)) {
        callback = async function () {
          for(let index=0; index<cycle.length; index++) {
            const step = cycle[index];
            await this.run(step, false, { isProgrammatic: true });
          }
        };
      } else throw new Error(`Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «Runnable.runSync»`);
    }
    Resolve_action: {
      let error = undefined;
      try {
        if(!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunStart", [{ metaprocess }], subject);
        output = await callback.call(subject);
        if(!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunSuccess", [{ metaprocess, output }], subject);
      } catch (originalError) {
        error = Error.create(originalError);
        if(!isProgrammatic) error = Std.functions.triggerMethodIfExists(subject, "onRunCatch", [error, { metaprocess, output }], subject) || error;
        throw error;
      } finally {
        if(!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunEnd", [{ metaprocess, output, error }], subject);
      }
    }
    return output;
  },
  runSync: function(cycle, cloneConfig = false, metaprocess = {}) {
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
        if (!(cycle in subject)) throw new Error(`Parameter «cycle» must be key in «subject» but «${cycle}» was found instead on «Runnable.runSync»`);
        callback = subject[cycle];
      } else if (typeof cycle === "function") {
        callback = cycle;
      } else if (Array.isArray(cycle)) {
        callback = function () {
          for(let index=0; index<cycle.length; index++) {
            const step = cycle[index];
            this.run(step, false, { isProgrammatic: true });
          }
        };
      } else throw new Error(`Parameter «cycle» must be string, function or array but «${typeof cycle}» was found instead on «Runnable.runSync»`);
    }
    Resolve_action: {
      let error = undefined;
      try {
        if(!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunStart", [{ metaprocess }], subject);
        output = callback.call(subject);
        if(!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunSuccess", [{ metaprocess, output }], subject);
      } catch (originalError) {
        error = Error.create(originalError);
        if(!isProgrammatic) error = Std.functions.triggerMethodIfExists(subject, "onRunCatch", [error, { metaprocess, output }], subject) || error;
        throw error;
      } finally {
        if(!isProgrammatic) Std.functions.triggerMethodIfExists(subject, "onRunEnd", [{ metaprocess, output, error }], subject);
      }
    }
    return output;
  }
}