Object.assign({
  start(instructions, options = false, injection = false) {
    if (!!options?.serie) return this.startSerie(instructions, injection);
    else if (!!options?.parallel) return this.startParallel(instructions, injection);
    return this.startSync(instructions, injection);
  }
}, RunnableSync, RunnableSerie, RunnableParallel, RunnableRace)