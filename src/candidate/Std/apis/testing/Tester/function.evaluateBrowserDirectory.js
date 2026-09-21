async function evaluateBrowserDirectory({ directory }) {
  /**@:
   * 
   * # Std.classes.Tester.evaluateDirectory
   * 
   * - Método para evaluar un directorio de tests en node.js
   * - El fichero tiene que exportar una función asíncrona o síncrona.
   * - La firma es `evaluateBrowserDirectory(options:Object)`
   * - Tiene solo una opción en options:
   *    - `{directory:String}`: necesario.
   *       - tiene que ser un rootpath al directorio real donde están los tests
   *       - **y también** tiene que existir en `$moduler.settings.data.browser.test.directories` como clave
   *       - el `@/dev/settings.js` tiene en `#browser/test/directories` un mapa con:
   *          - como clave, un rootpath así: '@/dist/www/dev/test/xxx'
   *          - como valor, da igual, porque se encarga el `DevBinaryV6.prototype.utils.exportDevSettings` de copiar las claves y completar los valores en `@/dist/www/dev/settings/publicable.json`
   *          - y la llamada a `exportDevSettings` la puedes provocar desde el `devbin loop` simplemente guardando `@/dev/settings.js`
   *          - por lo cual, si añades un nuevo test de navegador en la colección de test públicos, guarda de nuevo el `@/dev/settings.js` y los publicables se actualizarán automáticamente, de `@/dev/settings.js` a `@/dist/www/dev/settings/publicable.json`
   * - Lanzará los mismos triggers que evaluateDirectory.
   * 
   */
  await $moduler.settings.load();
  const hasDirectory = directory in ($moduler.settings.data?.browser?.test?.directories || {});
  Std.assert(hasDirectory, `Required parameter «options.directory» to exists as key in «$moduler.settings.data.browser.test.directories» but «${directory}» was found instead on «Tester.evaluateBrowserDirectory»`);
  const { files = [] } = $moduler.settings.data.browser.test.directories[directory];
  const allErrors = [];
  Std.objects.Ansi.style("blackBright,bold").print(`[*] ModulerV6 is starting test collection with ${files.length} files of: ${directory}`);
  await Std.functions.triggerMethodIfExists(this, "onBeforeTestCollection", [{ collection: directory, }]);
  Iterating_collections:
  for (let indexTest = 0; indexTest < files.length; indexTest++) {
    const testPath = files[indexTest];
    Std.objects.Ansi.style("cyan").print(`[*] ModulerV6 is importing test of: ${testPath}`);
    const testCallback = await $moduler.import(testPath);
    Std.assert(typeof testCallback === "function", `Test at «${$moduler.rootdirOf(testPath)}» is not exporting a callback to evaluate on «Std.classes.Tester.evaluateBrowserDirectory»`);
    const testResult = await this.evaluateCallback(testCallback, { collection: directory });
    if(testResult instanceof Error) allErrors.push({ path: testPath, error: testResult });
  }
  if(allErrors.length) {
    await Std.functions.triggerMethodIfExists(this, "onTestCollectionFailure", [{ collection: directory, errors: allErrors }]);
  } else {
    await Std.functions.triggerMethodIfExists(this, "onTestCollectionSuccess", [{ collection: directory }]);
  }
  await Std.functions.triggerMethodIfExists(this, "onAfterTestCollection", [{ collection: directory, }]);
  if(allErrors.length) {
    throw Error
      .normalize({ name: "TestError", message: `Test collection «${directory}» failed with ${allErrors.length} errors` })
      .adding(...allErrors.map(it => it.error))
      .unified();
  }
}