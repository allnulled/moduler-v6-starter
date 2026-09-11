async function evaluateDirectory(optionsBrute = {}) {
  let options;
  const {
    directory,
    filename,
    filter,
    ignored,
    title,
    injection,
  } = options = $moduler.toolkit.normalizeOptions(optionsBrute, {
    directory: {
      validate: it => typeof it === "string" ? true : `Parameter «directory» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
    },
    filename: {
      default: false,
      validate: it => it === false ? true : typeof it === "string" ? true : `Parameter «filename» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
    },
    ignored: {
      default: [],
      validate: it => Array.isArray(it) ? true : `Parameter «ignored» must be array but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
    },
    filter: {
      default: false,
      validate: it => it === false ? true : typeof it === "string" ? true : `Parameter «filter» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
    },
    title: {
      default: false,
      validate: it => typeof it === "string" ? true : `Parameter «title» must be string but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
    },
    injection: {
      default: {},
      validate: it => it === false ? true : typeof it === "object" ? true : `Parameter «injection» must be object but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
    },
  });
  if(Std.all.Environmenter.isBrowser) {
    Std.all.Environmenter.throw("Environment of browser is not supported right now on «Std.classes.Tester.evaluateDirectory»");
  } else if(Std.all.Environmenter.isNodejs) {
    return this._evaluateDirectoryInNodejs(options);
  } else {
    Std.all.Environmenter.throw("Environment must be browser or node.js on «Std.classes.Tester.evaluateDirectory»");
  }
  console.log(directory);
  console.log(filename);
  console.log(filter);
  console.log(ignored);
  console.log(title);
  console.log(injection);
}