{
  version: "1.0",
  traits: {
    Creable: $compiler.inject.source("./Creable/Creable.class.js"),
    Newable: $compiler.inject.source("./Newable/Newable.class.js"),
    Configurable: $compiler.inject.source("./Configurable/Configurable.class.js"),
    Clonable: $compiler.inject.source("./Clonable/Clonable.class.js"),
    Typeable: $compiler.inject.source("./Typeable/Typeable.class.js"),
    RunnableSync: $compiler.inject.source("./RunnableSync/RunnableSync.class.js"),
    RunnableSerie: $compiler.inject.source("./RunnableSerie/RunnableSerie.class.js"),
    RunnableParallel: $compiler.inject.source("./RunnableParallel/RunnableParallel.class.js"),
    RunnableRace: $compiler.inject.source("./RunnableRace/RunnableRace.class.js"),
  },
  classes: {
    Cycle: $compiler.inject.source{
      
        Object.assign(this, ...[
          StdCore.traits.Creable,
        ]),
        Object.assign(this.prototype, ...[
          StdCore.traits.Configurable,
          StdCore.traits.Typeable,
          StdCore.traits.RunnableSync,
          StdCore.traits.RunnableSerie,
          StdCore.traits.RunnableParallel,
          StdCore.traits.RunnableRace,
        ]),
        Object.defineProperties(this, Object.getOwnPropertyDescriptors(StdCore.traits.Newable));
      
    }
  }
}