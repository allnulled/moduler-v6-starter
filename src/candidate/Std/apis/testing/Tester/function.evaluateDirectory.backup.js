async function evaluateDirectory(optionsBrute = {}) {
  /**@:
   * 
   * # Std.classes.Tester.evaluateDirectory
   * 
   * - Método para evaluar un directorio de tests en node.js
   * - El fichero tiene que exportar una función asíncrona o síncrona.
   * - La firma es `evaluateDirectory(options:Object)`
   * - Tiene varias opciones en options:
   *    - `{directory:String}`: necesario, ruta del directorio
   *    - `{filename?:String}`: nombre de fichero
   *       - a) si sí se especifica, el primer nivel de ficheros se considera directorio, y que el test está en el mismo nombre de fichero que se indica aquí
   *       - b) si no se especifica, el primer nivel de ficheros se consideran los tests, directamente
   *       - El framework para sus tests usa la a).
   *    - `{filter?:Function}`: función para filtrar por nombre los ficheros que sí quieres usar como test
   *       - recibe un objeto con `{ id:String, path:String, callback:Function }
   *    - `{ignored?:[String]}`: lista de substrings que, de aparecer en el fichero, no quieres usar como test
   *       - si empieza con `^` se discrimina usando `startsWith` en lugar de `includes`
   *       - se aplica después del filter
   *       - parámetro un poco pachim pacham, seguramente se acabe cambiando por una función igual que filter o incluso desapareciendo
   *       - desaconsejo su uso
   *    - `{title?:String}`: nombre de la colección de tests, se usa como referencia en logs y errores.
   *    - `{injection?}:Object`
   *       - `progresser:Std.classes.Progresser`: se puede usar en los tests para monitorizar el progreso de cada test callback
   *       - `...otros`: puedes inyectar lo que quieras a los tests
   * - Lanzará los triggers, que puedes configurar con `.config({ ... })`:
   *    - por parte propia:
   *       - `onBeforeTestCollection`
   *       - `onAfterTestCollection`
   *    - por parte del `evaluateCallback`:
   *       - `onBeforeTest`
   *       - `onTestSuccess`
   *       - `onTestFailure`
   *       - `onAfterTest`
   * 
   */
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", { name: "TesterInterface.static.evaluateDirectory" });
  let output;
  let options;
  try {
    Directory_evaluation: {
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
          validate: it => it === false ? true : typeof it === "function" ? true : `Parameter «filter» must be function but «${typeof it}» was found instead on «Std.classes.Tester.evaluateDirectory»`,
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
      if (Std.all.Environmenter.isBrowser) {
        $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TesterInterface.static.evaluateDirectory" });
        return await this.evaluateBrowserDirectory(options);
      }
      const tests = await require("fs").promises.readdir(directory);
      Std.objects.Ansi.style("bgCyan,black").print(`[*] Std.classes.Tester found ${tests.length} tests to run on collection «${title}»`);
      const errors = [];
      const start = new Date();
      let preparation = [];
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
            $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "TesterInterface.static.evaluateDirectory" });
            throw Error.normalize({ name: "MissingTestError", message: `Collection of tests «${title}» is missing file «${testId}» on «Std.classes.Tester.evaluateDirectory»` });
          }
        }
        let test;
        Extract_test: {
          try {
            // Descachea el test:
            delete require.cache[testPath];
            // Extrae el test:
            test = require(testPath);
          } catch (error) {
            $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "TesterInterface.static.evaluateDirectory" });
            throw Error.normalize(error).adding({ name: "TestLoadError", message: `Collection of tests «${title}» could not load using «require» test nº${index + 1}/${tests.length} of «${testId}» on «Std.classes.Tester.evaluateDirectory»` });
          }
        }
        Validate_test: {
          if (typeof test !== "function") Error.throw({ name: "TestExportationError", message: `Failed to load test nº${index + 1}/${tests.length} of «${testId}» because it is exporting «${typeof test}» instead of function on «Std.classes.Tester.evaluateDirectory»` });
        }
        preparation.push({ id: testId, path: testPath, callback: test });
      }
      Filter_tests: {
        if (filter) {
          Option_of_filter: {
            preparation = preparation.filter(filter);
          }
        }
        if (ignored) {
          Option_of_ignored: {
            preparation = preparation.filter(test => {
              Iterating_ignored:
              for (let indexIgnored = 0; indexIgnored < ignored.length; indexIgnored++) {
                const ignoreSelector = ignored[indexIgnored];
                if (typeof ignoreSelector === "string") {
                  if (ignoreSelector.startsWith("^")) {
                    if (test.id.startsWith(ignoreSelector.substr(1))) {
                      return false;
                    }
                  } else if (test.id.includes(ignoreSelector)) {
                    return false;
                  }
                } else throw Error.normalize({ name: "TestIgnoredBadSelectorTypeError", message: `Parameter «ignored» at index «${indexIgnored}» must be string on «Tester.evaluateDirectoryInNodejs»` });
              }
              return true;
            });
          }
        }
      }
      await Std.functions.triggerMethodIfExists(this, "onBeforeTestCollection", [{ collection: directory }]);
      Execution:
      for (let index = 0; index < preparation.length; index++) {
        const { id, path, callback } = preparation[index];
        let result;
        try {
          result = await this.evaluateCallback(callback, injection);
          if(result instanceof Error) throw result;
          Std.objects.Ansi.style("bgGreen,black").print(`[*] Passed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`);
          await Std.functions.triggerMethodIfExists(this, "onTestCollectionSuccess", [{ collection: directory }]);
        } catch (error) {
          await Std.functions.triggerMethodIfExists(this, "onTestCollectionFailure", [{ collection: directory }]);
          Std.objects.Ansi.style("bgRed,black").print(`[!] Failed «${id}» [nº${index + 1}/${tests.length}] [${time()}]`);
          Std.objects.Ansi.style("red").print(`    Error: ${error.name}     `);
          Std.objects.Ansi.style("red").print(`    Message: ${error.message}   `);
          errors.push({
            id,
            error: Error.normalize(error).adding({ name: "TestFailed", message: `Failed «${id}» [nº${index + 1}/${tests.length}] [${time()}]` }),
          });
        }
      }
      if(errors.length) await Std.functions.triggerMethodIfExists(this, "onTestCollectionFailure", [{ collection: directory, errors }]);
      await Std.functions.triggerMethodIfExists(this, "onAfterTestCollection", [{ collection: directory }]);
      if (!errors.length) {
        Std.objects.Ansi.style("bgGreen,black").print(`[*] Passed all tests for: ${title}`);
      } else {
        Std.objects.Ansi.style("bgBlack,white,bold").print(`🔴 Failed ${errors.length} tests on collection «${title}», see details:`);
        const printErrors = function (list, pointer = []) {
          for (let index = 0; index < list.length; index++) {
            const item = list[index];
            printError(item, pointer.concat([index]));
          }
        };
        const printError = function (error, pointer = []) {
          console.log(`[Error=${pointer.join(".")}] ${error.name}: ${error.message}`);
          console.log(error.stack);
          if (error?.std?.history) {
            printErrors(error.std.history, pointer.concat([]));
          }
          Print_syntax_error_details:
          if(error.location) {
            //break Print_syntax_error_details;
            console.log("Location", error.location);
            console.log("Found", error.found);
            console.log("Expected");
            console.log(error.expected.map((it, index) => {
              if(it?.type === "class")   return `${ JSON.stringify(it.parts) } (class)`;
              if(it?.type === "literal") return `${ JSON.stringify(it.text) } (literal)`;
              return it;
            }).filter((it, index, all) => {
              return all.indexOf(it) === index;
            }).reverse().map((it, index) => {
              return `   - ${index+1}. ${it}`;
            }).join("\n"));
          }
        }
        for (let index = 0; index < errors.length; index++) {
          const details = errors[index];
          Std.objects.Ansi.style("bgMagenta,black").print(`🐞 [ERR=${index + 1}/${errors.length}] ${details.id} [TEST=${index + 1}/${tests.length}]`);
          printError(details.error, [index]);
        };
        Std.objects.Ansi.style("bgBlack,white,bold").print(`🔴 End of the ${errors.length} errors report on collection «${title}».`);
      }
    }
    $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", { name: "TesterInterface.static.evaluateDirectory" });
    return true;
  } catch (error) {
    $compiler.inject.template("@/src/candidate/Std/snippets/methodError.js", { name: "TesterInterface.static.evaluateDirectory" });
    throw error;
  }
}