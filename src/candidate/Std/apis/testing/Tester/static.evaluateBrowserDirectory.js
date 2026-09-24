async function evaluateBrowserDirectory(...args) {
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
  $moduler.assert(args.length > 0, "Required 1 argument at least on «Tester.evaluateBrowserDirectory»");
  const [options] = args;
  $moduler.assert(typeof options === "object", `Required parameter «options» to be object but «${typeof options}» was found instead on «Tester.evaluateBrowserDirectory»`);
  const {directory} = options;
  $moduler.assert(typeof directory === "string", `Required parameter «directory» to be string but «${typeof directory}» was found instead on «Tester.evaluateBrowserDirectory»`);
  await $moduler.settings.load();
  const allDirectories = $moduler.settings.data.browser.test.directories;
  $moduler.assert(typeof directory === "string", "Required parameter «directory» to be string on «Tester.evaluateBrowserDirectory»");
  $moduler.assert(directory in allDirectories, `Required parameter «directory» to be a key in «$moduler.settings.data.browser.test.directories» but «${directory}» was found instead on «Tester.evaluateBrowserDirectory»`);
  Object.assign(options, allDirectories[directory]);
  return await this.evaluateDirectory(options);

}