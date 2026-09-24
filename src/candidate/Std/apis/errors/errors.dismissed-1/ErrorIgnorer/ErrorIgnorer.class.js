class ErrorIgnorer {

  /**@:
   * 
   * # Std.classes.ErrorIgnorer
   * 
   * - Sirve para filtrar frames de trazas (`error.stack > ErrorDissector.dissect`) de error que no aportan nueva información:
   *    - el error va a pasar por muchos frames de traza de *llamadas-comando* y va a generar muchas trazas que son ruido pero no aislan el error significativo
   *    - las llamadas-comando son funciones que se utilizan para llamar a otras funciones más significativas o específicas:
   *       - por ej. un bucle que aplica una acción
   *          - y sabemos que la que va a fallar, es la acción, no el bucle la acción se llama a través del bucle entonces siempre nos va a aparecer en la traza del error pero perdemos tiempo localizando el error de verdad y apartando estas *llamadas-comando* para esto existe ErrorIgnorer
   *       - por ej. una función que llama a otra, el patrón commander del GoF
   *          - la función llamadora, no suele ser el problema, pero genera ruido igual
   *       - por ej. la API de errores
   *          - la función que se encarga de lanzar el error, siempre nos aparecerá, un `Error.prototype.throw` siempre aparecería en la traza
   * - `Std.classes.ErrorIgnorer.globally` se usa por `Std.classes.ErrorDissector` para filtrar directamente los stack frames
   *    - pero es una instancia, que se le pasa paramétricamente a `Std.classes.ErrorDissector.dissect` y que por defecto es `Std.classes.ErrorIgnorer.globally`
   * 
   */

  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  
  constructor() {
    this.ignorers = [];
  }
  
  addIgnorers(...namesOrFilters) {
    this.ignorers.push(...namesOrFilters);
  }
  
  static globally = this.new;
  
  static {
    /*
    this.globally.addIgnorers(
      "Tester.evaluateCallback",
      "async Tester.evaluateDirectory",
      "async Tester.evaluateBrowserDirectory",
      "Std.all.ErrorExtension.Error.adding",
      "Std.all.ErrorExtension.Error.normalize",
      "async DevBinaryV6Utils.touchFile",
      "async DevBinaryV6Utils.propagateUpTouchEventFrom",
      "async DevBinaryV6Utils.executeUnitTestFileOf",
      "async DevBinaryV6Utils.triggerCallbackFromFile",
      "async DevBinaryV6.command",
      "async /home/carlos/Escritorio/Programas/moduler-v6-starter/test/unit/src/candidate/Std/Std.test.js",
    );
    //*/
  }

}