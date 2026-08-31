(async function () {
  class Reactor {
    static create(...args) {
      return new this(...args);
    }
    constructor() {
      this.listeners = {};
    }
    assert(condition, message, onError) {
      if (!condition) {
        if (onError) onError();
        throw new Error(message);
      }
    }
    setListeners(listeners) {
      Object.assign(this.listeners, Object.keys(listeners).reduce((output, key) => {
        const v = listeners[key];
        output[key] = Array.isArray(v) ? v : [v];
        return output;
      }, {}));
      return this;
    }
    on(event) {
      this.listeners[event] = this.listeners[event] || [];
      return {
        follow: this._onEventFollow(event),
        precede: this._onEventPrecede(event),
        replace: this._onEventReplace(event),
      }
    }
    _validatePostevents(postevents, sourcevent) {
      for (let index = 0; index < postevents.length; index++) {
        const postevent = postevents[index];
        this.assert(["string", "function"].includes(typeof postevent), `Reactor event «${sourcevent}» at listener index «${index}» is required to be string or function but type «${typeof postevent}» was found instead`);
      }
    }
    _validateEvent(firstEvent) {
      this.assert(["string"].includes(typeof firstEvent), `Reactor event is required to be «string» but type of «${typeof firstEvent}» was found instead`);
    }
    _onEventFollow(firstEvent) {
      this._validateEvent(firstEvent);
      return (...otherEvents) => {
        this._validatePostevents(otherEvents, firstEvent);
        this.listeners[firstEvent].push(...otherEvents);
        return this;
      }
    }
    _onEventPrecede(firstEvent) {
      this._validateEvent(firstEvent);
      return (...otherEvents) => {
        this._validatePostevents(otherEvents, firstEvent);
        this.listeners[firstEvent].unshift(...otherEvents);
        return this;
      }
    }
    _onEventReplace(firstEvent) {
      this._validateEvent(firstEvent);
      return (...otherEvents) => {
        this._validatePostevents(otherEvents, firstEvent);
        this.listeners[firstEvent] = [otherEvents];
        return this;
      }
    }
    _noop() { }
    async trigger(event, parameters = {}) {
      if (!(event in this.listeners)) return undefined;
      const subevents = this.listeners[event];
      const output = [];
      for (let index = 0; index < subevents.length; index++) {
        let listener;
        const selector = subevents[index];
        if (typeof selector === "function") {
          listener = selector;
        } else if (typeof selector === "string") {
          listener = () => this.trigger(selector, parameters);
        } else if (selector === null) {
          listener = this._noop;
        }
        this.assert(typeof listener === "function", `Reactor.prototype.trigger found that event «${event}» at listener index «${index}» is required to be function or string but «${typeof selector}» was found instead`);
        try {
          const result = await listener(parameters);
          output.push(result);
        } catch (error) {
          output.push(error);
          console.log(`[!] Failed async event «${event}» at listener index «${index}» on method «Reactor.prototype.trigger»`);
        }
      }
      return output;
    }
    list(printIt = false) {
      if (printIt) console.log(this.listeners);
      return this.listeners;
    }
  }

  const reactor = Reactor.create();

  let messages = [];

  reactor.setListeners({
    main: null,
    prepare: function () {
      messages.push("prepare");
    },
    before: function () {
      messages.push("before");
    },
    after: function () {
      messages.push("after");
    },
    start: function () {
      messages.push("start");
    },
    process: function () {
      messages.push("process");
    },
    finish: function () {
      messages.push("finish");
    },
  });

  Test_1: {
    reactor.on("main").follow("start", "process", "finish");
    reactor.on("main").precede("prepare", "prepare", "prepare");
    reactor.on("main").precede("before");
    reactor.on("main").follow("after");
    await reactor.trigger("main");
    reactor.assert(messages[0] === "before", "Can put messages by trigger (0)");
    reactor.assert(messages[1] === "prepare", "Can put messages by trigger (1)");
    reactor.assert(messages[2] === "prepare", "Can put messages by trigger (2)");
    reactor.assert(messages[3] === "prepare", "Can put messages by trigger (3)");
    reactor.assert(messages[4] === "start", "Can put messages by trigger (4)");
    reactor.assert(messages[5] === "process", "Can put messages by trigger (5)");
    reactor.assert(messages[6] === "finish", "Can put messages by trigger (6)");
    reactor.assert(messages[7] === "after", "Can put messages by trigger (7)");
  }

  messages = [];






})();