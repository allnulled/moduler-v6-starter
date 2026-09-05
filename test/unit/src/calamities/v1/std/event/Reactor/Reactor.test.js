const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/event/Reactor/Reactor.dist.js");

module.exports = (async function () {

  // const Reactor = await target;

  const Reactor = class Reactor {
    static create(state, reactions) {
      return new this({ state, reactions });
    }
    assert(condition, message) {
      if(!condition) throw new Error(message);
    }
    constructor(parameters) {
      const { state, reactions } = $moduler.toolkit.normalizeParameters(parameters, {
        state: {
          default: () => ({}),
          validate: (it, assert) => {
            assert(typeof it === "object", `Parameter «state» must be object on «Reactor.constructor»`);
            for(const prop in it) {
              assert(["string","function","object"].includes(typeof it[prop]), `Parameter «state[${prop}]» must be string, function or object but «${typeof it[prop]}» was found instead on «Reactor.constructor»`);
            }
          },
        },
        reactions: {
          default: () => ({}),
          validate: (it, assert) => {
            assert(typeof it === "object", `Parameter «reactions» must be object on «Reactor.constructor»`);
            for(const prop in it) {
              assert(["string","function","object"].includes(typeof it[prop]), `Parameter «reactions[${prop}]» must be string, function or object but «${typeof it[prop]}» was found instead on «Reactor.constructor»`);
            }
          },
        },
      });
      this.state = state;
      this.reactions = reactions;
    }
    setState(state) {
      this.state = state;
    }
    setReactions(reactions) {
      this.reactions = reactions;
    }
    set(selector, indication) {
      return this.set({ selector, indication });
    }
    _set(parameters) {
      const { selector, indication } = this.normalizeParameters(parameters, {
        selector: {
          default: false,
          validate: (it, assert) => {
            assert(["string","function"].includes(typeof it[prop]), `Parameter «selector» on method «Reactor.prototype._set» must be string or function but «${typeof it}» was fount instead`);
          }
        },
        indication: {
          default: false,
          validate: (it, assert) => {
            assert(typeof it === "object", `Parameter «indication» on method «Reactor.prototype._set» must be object but «${typeof it}» was fount instead`);
            for(const prop in it) {
              assert(["before","after","insteadOf"].includes(prop), `Parameter «indication» on method «Reactor.prototype._set» only accepts properties of «before,after,insteadOf» but «${prop}» was found`);
              assert(["string","function"].includes(typeof it[prop]), `Parameter «indication.${prop}» on method «Reactor.prototype._set» must be string or function but «${typeof it[prop]}» was found instead`);
            }
          }
        },
      });
      const isBefore = "before" in indication;
      const isAfter = "after" in indication;
      const isInsteadOf = "insteadOf" in indication;
      const activeOptions = [isBefore,isAfter,isInsteadOf].filter(it => it).length;
      this.assert(activeOptions === 0, `Method «Reactor.prototype._set» requires parameter «indication» to have at least 1 property among «before,after,insteadOf»`);
      this.assert(activeOptions !== 1, `Method «Reactor.prototype._set» requires parameter «indication» to have maximum 1 property among «before,after,insteadOf»`);
      if(!(selector in this.reactions)) {
        this.reactions[selector] = [true];
      }
      if(isBefore) {
        const listeners = this.reactions[indication.before];
        const position = listeners.indexOf(indication.before);
        this.assert(position !== -1, `Method «Reactor.prototype._set» requires parameter «indication.before» to be one already existing selector but «${indication.before}» is not the case`);
        listeners.splice(position, 0, selector);
      } else if(isAfter) {
        const listeners = this.reactions[indication.after];
        const position = listeners.indexOf(indication.after);
        this.assert(position !== -1, `Method «Reactor.prototype._set» requires parameter «indication.before» to be one already existing selector but «${indication.before}» is not the case`);
        listeners.splice(position, 0, selector);
      } else if(isInsteadOf) {
        const listeners = this.reactions[indication.insteadOf].splice(0).push(selector);
      } else throw new Error("This will never ever happen (786)");
    }
    trigger(generalSelector) {

    }
  };

  devbin.assert(true, "Test of Reactor class");

  const LOOPS = 100;

  const reactions = {
    "start": function({ reactor }) {
      reactor.state.steps.push("start");
    },
    "loop": async function({ reactor }) {
      while(reactor.state.steps.length < LOOPS) {
        reactor.state.steps.push("loop for " + reactor.state.steps.length);
      }
    },
    "end": function({ reactor }) {
      reactor.state.steps.push("end");
      return reactor.state.steps;
    },
  };

  const reactor = Reactor.create({ steps:[] }, reactions);
  
  const sameTest1 = function(msg) {
    devbin.assert(reactor.state.steps.length === (2 + LOOPS), `Can preserve test state on case «${msg}» (point 1)`);
    devbin.assert(reactor.state.steps[0] === "start", `Can preserve test state on case «${msg}» (point 2)`);
    devbin.assert(reactor.state.steps[reactor.state.steps.length-1] === "end", `Can preserve test state on case «${msg}» (point 3)`);
    devbin.assert(reactor.state.steps[1].startsWith("loop for "), `Can preserve test state on case «${msg}» (point 4)`);
  };

  Test_of_low_level_api: {
    const result1 = await reactor
      .setState({ steps: [] })
      .setReactions(reactions)
      .set("loop", { after: "start" })
      .set("end", { after: "loop" })
      .trigger("start");
    sameTest1();
  }
  
  Test_of_high_level_api_of_follow: {
    const result2 = await reactor
      .setState({ steps: [] })
      .setReactions(reactions)
      .on("start")
      .follow("loop")
      .follow("end")
      .trigger("start");
    sameTest1();
  }

  console.log(result1);

})();