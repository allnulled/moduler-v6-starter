async function _evaluateDirectoryInNodejs({ directory, filename, ignored, filter, title, injection }) {
  const tests = await require("fs").promises.readdir(directory);
  Std.classes.Ansi.style("bgCyan,black").print(`[*] Std.classes.Tester found ${tests.length} tests to run on collection «${title}»`);
  const errors = [];
  const preparation = [];
  const start = new Date();
  let lastMoment = start;
  const time = function () {
    const newNow = new Date();
    const difference = (newNow - lastMoment).toFixed();
    lastMoment = newNow;
    return difference + "ms";
  };
  Load_and_validation:
  for (let index = 0; index < tests.length; index++) {
    const testId = tests[index];
    let testPath = `${directory}/${testId}`;
    Extract_path: {
      if (typeof filename === "string") {
        testPath = `${testPath}/${filename}`;
      }
    }
    Ensure_file_exists: {
      try {
        if (await require("fs").promises.access(testPath)) throw {};
      } catch (error) {
        throw Error.create({ name: "MissingTestError", message: `Collection of tests «${title}» is missing file «${testId}» on «Std.classes.Tester.evaluateDirectory»` });
      }
    }
    let test;
    Extract_test: {
      try {
        test = require(testPath);
      } catch (error) {
        throw Error.create(error).adding({ name: "TestLoadError", message: `Collection of tests «${title}» could not load using «require» test nº${index + 1}/${tests.length} of «${testId}» on «Std.classes.Tester.evaluateDirectory»` });
      }
    }
    Validate_test: {
      if (typeof test !== "function") Error.throw({ name: "TestExportationError", message: `Failed to load test nº${index + 1}/${tests.length} of «${testId}» because it is exporting «${typeof test}» instead of function on «Std.classes.Tester.evaluateDirectory»` });
    }
    preparation.push({ id: testId, path: testPath, callback: test });
  }
  Execution:
  for (let index = 0; index < preparation.length; index++) {
    const { id, path, callback } = preparation[index];
    let result;
    try {
      result = await callback(injection);
      Std.classes.Ansi.style("bgGreen,black").print(`[*] Passed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`)
    } catch (error) {
      Std.classes.Ansi.style("bgRed,black").print(`[!] Failed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`);
      Std.classes.Ansi.style("red").print(`    Error: ${error.name}     `);
      Std.classes.Ansi.style("red").print(`    Message: ${error.message}   `);
      errors.push({
        id,
        error: Error.create(error).adding({ name: "TestFailed", message: `Failed «${id}» [nº${index + 1}/${tests.length}] [${time()}]` }),
      });
    }
  }
  if (!errors.length) {
    Std.classes.Ansi.style("bgGreen,black").print(`[*] Passed all tests for: ${title}`);
  } else {
    Std.classes.Ansi.style("bgBlack,white,bold").print(`🔴 Failed ${errors.length} tests on collection «${title}», see details:`);
    const printErrors = function (list, pointer = []) {
      for(let index=0; index<list.length; index++) {
        const item = list[index];
        printError(item, pointer.concat([index]));
      }
    };
    const printError = function(error, pointer = []) {
      console.log(`[suberror:] [${pointer.join(".")}] ${error.name}:${error.message} ${error.stack}`);
      if (error.std?.history) {
        printErrors(error.std.history, pointer.concat([]));
      }
    }
    for (let index = 0; index < errors.length; index++) {
      const details = errors[index];
      Std.classes.Ansi.style("bgMagenta,black").print(`🐞 [ERR=${index + 1}/${errors.length}] ${details.id} [TEST=${index + 1}/${tests.length}]`);
      printError(details.error, [index]);
    };
    Std.classes.Ansi.style("bgBlack,white,bold").print(`🔴 End of the ${errors.length} errors report on collection «${title}».`);
  }
}