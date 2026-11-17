module.exports = globalThis.Std || $moduler.export("#Std", [], async function([]) {
  /**@:
   * 
   * ## Tabla de contenidos
   * 
   * {{ Table of contents }}
   * 
   * # Std
   * 
   * - Entry point for Std library.
   * - Depends on:
   *    - peggyjs
   *    - picomatch
   * - Injects:
   *    - ./Std.object.js
   * 
   */
  const [peggyjs, picomatch] = await Promise.all([
    $compiler.inject.module("@/src/www/external/pegjs/peggyjs.object.js"),
    $compiler.inject.module("@/src/external/picomatch/picomatch.entry.js"),
  ]);
  return $compiler.inject.source("./Std.object.js");
});