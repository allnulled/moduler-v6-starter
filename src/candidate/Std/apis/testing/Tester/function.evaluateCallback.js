async function evaluateCallback(callback, options = {}) {
  /**@:
   * 
   * # Std.classes.Tester.evaluateCallback
   * 
   * - Método para evaluar un callback de test en node.js o browser
   * - Su firma es: 
   *    - `callback:Function` - el test.
   *       - recibe en `arguments[0]:Object={Std,tester:Std.classes.Tester,...options}`, `
   *    - `options?:Object` - opciones que se inyectan al `callback` asignadas en `arguments[0]:Object`.
   *       - los triggers pueden acceder también en `arguments[0].options`
   * - Lanzará los triggers de:
   *    - `onBeforeTest`
   *    - `onAfterTest`
   *    - `onTestSuccess`
   *    - `onTestFailure`
   */
  "progresser" in options || (options.progresser = Std.all.Progresser.new);
  "collection" in options || (options.collection = "(callback)");
  let testError = undefined;
  let testOutput = undefined;
  try {
    await Std.functions.triggerMethodIfExists(this, "onBeforeTest", [{ options }]);
    testOutput = await callback({
      Std,
      tester: this,
      ...options,
    });
    await Std.functions.triggerMethodIfExists(this, "onTestSuccess", [{ options }]);
  } catch (error) {
    testError = Error.normalize(error);
    await Std.functions.triggerMethodIfExists(this, "onTestFailure", [{ options, error, }]);
  } finally {
    await Std.functions.triggerMethodIfExists(this, "onAfterTest", [{ options, }]);
  }
  return typeof testError !== "undefined" ? testError : testOutput;
}