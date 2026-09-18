module.exports = $moduler.export("#Std", [], async function([]) {
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
   * - Injects:
   *    - ./Std.object.js
   * 
   */
  const peggyjs = await $compiler.inject.module("@/src/www/external/pegjs/peggyjs.object.js");
  return $compiler.inject.source("./Std.object.js");
});