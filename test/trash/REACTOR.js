const Reactor = class Reactor {
  static create(state, actions = {}, reactions = {}) {
    return new this({ state, actions, reactions });
  }
  static symbols = {
    ALL: null,
    SELF: true,
  };
  assert(condition, message = "Unspecified error") {
    if (!condition) throw new Error(message);
  }
  constructor({ state, actions = {}, reactions = {} }) {
    this.state = state;
    this.functions = new Map();
    this.reactions = new Map(Object.entries(reactions));
  }
  _generateCausalismFor(action) {
    return {
      put: (newReaction) => this._generatePutConsequentialismFor(action, newReaction),
      follow: (newReaction) => this._generateFollowConsequentialismFor(action, newReaction, false),
      precede: (newReaction) => this._generateFollowConsequentialismFor(action, newReaction, true),
    };
  }
  _validateSubreactionSelector(reaction) {
    this.assert((reaction === null) || (reaction === true) || ["string", "function"].includes(typeof reaction), `Subreaction selector «${reaction}» is not valid`);
  }
  _isNull(reaction) {
    return reaction === null;
  }
  _putBefore(action, oldReaction = undefined, newReaction = undefined) {
    this._validateSubreactionSelector(oldReaction)
    return this[!this._isNull(oldReaction) ? "_putBeforeSubreaction" : "_putBeforeReaction"](action, oldReaction, newReaction);
  }
  _putAfter(action, oldReaction = undefined, newReaction = undefined) {
    this._validateSubreactionSelector(oldReaction)
    return this[!this._isNull(oldReaction) ? "_putAfterSubreaction" : "_putAfterReaction"](action, oldReaction, newReaction);
  }
  _putInsteadOf(action, oldReaction, newReaction = undefined) {
    this._validateSubreactionSelector(oldReaction)
    return this[!this._isNull(oldReaction) ? "_putInsteadSubreaction" : "_putInsteadReaction"](action, oldReaction, newReaction);
  }
  _generatePutConsequentialismFor(action, newReaction) {
    return {
      before: oldReaction => this._putBefore(action, oldReaction, newReaction),
      after: oldReaction => this._putAfter(action, oldReaction, newReaction),
      insteadOf: oldReaction => this._putInsteadOf(action, oldReaction, newReaction),
    }
  }
  _generateFollowConsequentialismFor(action, reaction, isPreceding = false) {
    this[isPreceding ? "_putBefore" : "_putAfter"](action, null, reaction);
    return Object.create({...this.on(reaction)}, this);
  }
  on(action) {
    return this._generateCausalismFor(action);
  }
  _getFunctionByReaction(action) {
    return this.functions.get(action) || undefined;
  }
  _getSubreactionFrom(oldReaction, action) {
    if(oldReaction === true) {
      return this._getFunctionByReaction(action);
    }
    return oldReaction;
  }
  _putBeforeReaction(action, oldReaction, newReaction) {
    return this._modifyReaction(action, list => {
      list.unshift(newReaction);
    });
  }
  _putBeforeSubreaction(action, oldReaction, newReaction = undefined) {
    return this._modifySubreaction(action, oldReaction, (list) => {
      const pos = list.indexOf(this._getSubreactionFrom(oldReaction, action));
      this.assert(pos !== -1,`Could not find on event «${action}» reaction «${oldReaction}» on method «Reactor.prototype._putBeforeSubreaction»`);
      list.splice(pos, 0, newReaction);
    });
  }
  _putAfterReaction(action, oldReaction, newReaction) {
    return this._modifyReaction(action, list => {
      list.push(newReaction);
    });
  }
  _putAfterSubreaction(action, oldReaction, newReaction = undefined) {
    return this._modifySubreaction(action, oldReaction, (list) => {
      const pos = list.indexOf(this._getSubreactionFrom(oldReaction, action));
      this.assert(pos !== -1,`Could not find on event «${action}» any reaction «${oldReaction}» on method «Reactor.prototype._putAfterSubreaction»`);
      list.splice(pos + 1, 0, newReaction);
    });
  }
  _putInsteadReaction(action, newReaction) {
    throw new Error("This is an ambiguous method and should be avoided by now");
  }
  _putInsteadSubreaction(action, oldReaction, newReaction = undefined) {
    return this._modifySubreaction(action, oldReaction, (list) => {
      const pos = list.indexOf(this._getSubreactionFrom(oldReaction, action));
      this.assert(pos !== -1, `Could not find on event «${action}» any reaction «${oldReaction}» on method «Reactor.prototype._putInsteadSubreaction»`);
      list.splice(pos, 1, newReaction);
    });
  }
  _modifyReaction(action, modifier) {
    const list = this.reactions.get(action);
    this.assert(Array.isArray(list), `Could not find action «${action}» on method «Reactor.prototype._modifyReaction»`);
    modifier(list);
    return this;
  }
  _modifySubreaction(action, reaction, modifier) {
    const list = this.reactions.get(action);
    this.assert(Array.isArray(list), `Could not find action «${action}» on method «Reactor.prototype._modifySubreaction»`);
    // this.assert(list.indexOf(reaction) !== -1, `Could not find on action «${action}» any reaction «${reaction}» on method «Reactor.prototype._modifySubreaction»`);
    modifier(list);
    return this;
  }
  trigger(action, parameters = {}) {
    const events = this.reactions.get(action) || [];
    this.assert(Array.isArray(events), `Parameter «action» should point to an array but «${events}» was found instead on method «Reactor.prototype.trigger»`);
    const allEvents = [];
    let hasPromises = false;
    for(let indexEvent=0; indexEvent<events.length; indexEvent++) {
      const item = events[indexEvent];
      this._triggerReaction(item, parameters);
    }
    return hasPromises ? Promise.all(allEvents) : allEvents;
  }
  _triggerReaction(triggeable, parameters) {
    if(typeof triggeable === "function") {
      return triggeable({ reactor: this, ...parameters, });
    } else if(typeof triggeable === "string") {
      return this._triggerReaction(this.reactions.get(triggeable), parameters);
    } else if(Array.isArray(triggeable)) {
      return triggeable.map(it => this._triggerReaction(it, parameters));
    } else if(typeof triggeable === "undefined") {
      return undefined;
    }
    return triggeable;
  }
  setState(state) {
    this.state = state;
    return this;
  }
  _getReactionsByName(action) {
    if(this.reactions.has(action)) {
      return this.reactions.get(action);
    }
    const output = [];
    this.reactions.set(action, output);
    return output;
  }
  _getReactionsByFunction(reaction, id) {
    if(!this.functions.has(reaction)) {
      this.functions.set(id, reaction);
    }
    return [this.functions.get(id)];
  }
  _validateReaction(reaction, id, all, allowNull = false) {
    if(typeof reaction === "string") return this._getReactionsByName(reaction);
    if(typeof reaction === "function") return this._getReactionsByFunction(reaction, id);
    if(reaction === true) return [id];
    if(allowNull && (reaction === null)) return all;
    throw new Error(`Validation must be string, function, true or null but «${typeof reaction}» was found instead on key «${id}» on method «Reactor.prototype._validateReaction»`);
  }
  setReactions(data) {
    this.reactions = new Map();
    for(const prop in data) {
      const reaction = this._validateReaction(data[prop], prop, data, false);
      this.reactions.set(prop, reaction);
    }
    return this;
  }
};

const dic = {
  start: ({ reactor }) => {
    reactor.state.steps.push("start");
  },
  loop: ({ reactor }) => {
    reactor.state.steps.push("loop");
  },
  end: ({ reactor }) => {
    reactor.state.steps.push("end");
  },
};

const dicExtensions1 = {
  start_before: ({ reactor }) => { reactor.state.steps.push("start_before") },
  start_after: ({ reactor }) => { reactor.state.steps.push("start_after") },
  end_before: ({ reactor }) => { reactor.state.steps.push("end_before") },
  end_after: ({ reactor }) => { reactor.state.steps.push("end_after") },
  finished: ({ reactor }) => { reactor.state.steps.push("finished") },
}

const reactor = Reactor.create();

const assert = reactor.assert;

Test_api_low_level_other_functions_1: {
  reactor.setState({ steps: [] });
  reactor.setReactions({
    ...dic,
    ...dicExtensions1,
  });
  reactor.on("loop").put("end").after(Reactor.symbols.ALL);
  reactor.on("loop").put("start").before(Reactor.symbols.ALL);
  reactor.on("loop").put("start_before").before("start");
  reactor.on("loop").put("start_after").after("start");
  reactor.on("loop").put("loop_before").before(Reactor.symbols.SELF);
  reactor.on("loop").put("loop_after").after(Reactor.symbols.SELF);
  reactor.on("loop").put("end_before").before("end");
  reactor.on("loop").put("end_after").after("end");
  reactor.on("loop").put("finished").insteadOf("end_after"); // Esto cambia un string por otro
  assert(reactor.state.steps.length === 0, "Can read steps after triggered (1)");
  reactor.trigger("loop");
  assert(reactor.state.steps.length === 7, "Can find messages (2)");
  assert(reactor.state.steps[0] === "start_before", "Can find messages (3)");
  assert(reactor.state.steps[1] === "start", "Can find messages (4)");
  assert(reactor.state.steps[2] === "start_after", "Can find messages (5)");
  assert(reactor.state.steps[3] === "loop", "Can find messages (6)");
  assert(reactor.state.steps[4] === "end_before", "Can find messages (7)");
  assert(reactor.state.steps[5] === "end", "Can find messages (8)");
  assert(reactor.state.steps[6] === "finished", "Can find messages (9)");
}

Test_api_low_level_other_functions_2: {
  reactor.setState({ steps: [] });
  reactor.setReactions({
    ...dic,
    ...dicExtensions1,
  });
  reactor.on("loop").put("end").after(Reactor.symbols.ALL);
  reactor.on("loop").put("start").before(Reactor.symbols.ALL);
  reactor.on("loop").put("start_before").before("start");
  reactor.on("loop").put("start_after").after("start");
  reactor.on("loop").put("loop_before").before(Reactor.symbols.SELF);
  reactor.on("loop").put("loop_after").after(Reactor.symbols.SELF);
  reactor.on("loop").put("end_before").before("end");
  reactor.on("loop").put("end_after").after("end");
  reactor.on("loop").put("finished").insteadOf("end_after"); // Esto cambia un string por otro
  assert(reactor.state.steps.length === 0);
  reactor.trigger("loop");
  assert(reactor.state.steps.length === 7);
  assert(reactor.state.steps[0] === "start_before", "Failed to load «start_before» using low level api methods");
  assert(reactor.state.steps[1] === "start", "Failed to load «start» using low level api methods");
  assert(reactor.state.steps[2] === "start_after", "Failed to load «start_after» using low level api methods");
  assert(reactor.state.steps[3] === "loop", "Failed to load «loop» using low level api methods");
  assert(reactor.state.steps[4] === "end_before", "Failed to load «end_before» using low level api methods");
  assert(reactor.state.steps[5] === "end", "Failed to load «end» using low level api methods");
  assert(reactor.state.steps[6] === "finished", "Failed to load «finished» using low level api methods");
}

Test_api_high_level: {
  reactor.setState({ steps: [] });
  reactor.setReactions({
    ...dic,
    ...dicExtensions1,
  });
  reactor.on("start").precede("start_before");
  reactor.on("start").follow("start_after");
  reactor.on("loop").precede("start");
  reactor.on("loop").follow("end");
  reactor.on("end").precede("end_before");
  reactor.on("end").follow("end_after").follow("finished");
  assert(reactor.state.steps.length === 0);
  reactor.trigger("loop");
  assert(reactor.state.steps.length === 8);
  assert(reactor.state.steps[0] === "start_before", "Failed to load «start_before» using high level api methods");
  assert(reactor.state.steps[1] === "start", "Failed to load «start» using high level api methods");
  assert(reactor.state.steps[2] === "start_after", "Failed to load «start_after» using high level api methods");
  assert(reactor.state.steps[3] === "loop", "Failed to load «loop» using high level api methods");
  assert(reactor.state.steps[4] === "end_before", "Failed to load «end_before» using high level api methods");
  assert(reactor.state.steps[5] === "end", "Failed to load «end» using high level api methods");
  assert(reactor.state.steps[6] === "end_after", "Failed to load «end_after» using high level api methods");
  assert(reactor.state.steps[7] === "finished", "Failed to load «finished» using high level api methods");
}