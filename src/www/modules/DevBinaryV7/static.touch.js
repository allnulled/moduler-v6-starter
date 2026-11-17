static touch (file, options) {
  let out = [];
  const picomatch = require("picomatch");
  const reactors = options.reactors;
  Iterating_reactors:
  for(let index=0; index<reactors.length; index++) {
    const reactor = reactors[index];
    if(!picomatch.isMatch(file, reactor.from)) {
      continue Iterating_reactors;
    }
    const result = reactor.do(file, options);
    out = out.concat([ result ]);
  }
  return out;
}