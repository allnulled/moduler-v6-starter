async function evaluateDirectory(options = {}) {
  /**@:
   * 
   * # Std.classes.Tester.evaluateDirectory
   * 
   * - Mismas firmas que `Std.classes.Tester.evaluateBrowserDirectory`.
   * 
   */
  const { files, directory = "(not specified)", injection = {}, debug = false } = options;
  $moduler.assert(Array.isArray(files), `Required parameter «files» to be array but «${typeof files}» was found instead on «Std.classes.Tester.evaluateDirectory»`);
  $moduler.assert(typeof directory === "string", `Required parameter «directory» to be string but «${typeof directory}» was found instead on «Std.classes.Tester.evaluateDirectory»`);
  $moduler.assert(typeof injection === "object", `Required parameter «injection» to be object but «${typeof injection}» was found instead on «Std.classes.Tester.evaluateDirectory»`);
  await $moduler.settings.load();
  if(files.length === 0) {
    return 0;
  }
  const allErrors = [];
  Std.objects.Ansi.style("bgCyan,black,underline").print(`[*] Tester begins test directory with ${files.length} files of: ${$moduler.rootdirOf(directory)}`);
  await Std.functions.triggerMethodIfExists(this, "onBeforeTestCollection", [{ ...options, }]);
  Iterating_collections:
  for (let indexTest = 0; indexTest < files.length; indexTest++) {
    const file = files[indexTest];
    const testPath = $moduler.normalizationOf(file);
    try {
      Std.objects.Ansi.style("cyan").print(`[*] Tester runs test directory ${indexTest+1}/${files.length} of: ${$moduler.rootdirOf(testPath)}`);
      const testCallback = await $moduler.import(testPath);
      Std.assert(typeof testCallback === "function", `Test at «${$moduler.rootdirOf(testPath)}» is not exporting a callback to evaluate on «Std.classes.Tester.evaluateBrowserDirectory»`);
      const testResult = await this.evaluateCallback(testCallback, { ...options, ...options.injection });
      if (testResult instanceof Error) throw testResult;
    } catch (error) {
      allErrors.push(Error.normalize(error).config({ test: file.split("/").at(-2), path: testPath }));
    }
  }
  if (allErrors.length) {
    await Std.functions.triggerMethodIfExists(this, "onTestCollectionFailure", [{ ...options, errors: allErrors }]);
  } else {
    await Std.functions.triggerMethodIfExists(this, "onTestCollectionSuccess", [{ ...options }]);
  }
  await Std.functions.triggerMethodIfExists(this, "onAfterTestCollection", [{ ...options, }]);
  Report_success_or_errors: {
    if (!allErrors.length) {
      Std.objects.Ansi.style("bgGreen,black,underline").print(`[*] Tester passed test directory of: ${$moduler.rootdirOf(directory)}`);
      break Report_success_or_errors;
    }
    Std.objects.Ansi.style("bgRed,black").print(`\n[!!] Tester.evaluateDirectory has reported ${allErrors.length} errors on test directory at:\n     ${$moduler.rootdirOf(directory)}`);
    if(!debug) console.log(await Error.stringify(allErrors));
    else console.log(await Error.stringifyProsecutedList(allErrors));
  }
}