module.exports = $moduler.import([
  "@/dist/www/modules/Refrescador/Refrescador.dist.js",
  "@/dist/www/modules/CompilerV7/CompilerV7.dist.js",
], function() {
  return Std.all.DevBinaryV7 = Std.classes.DevBinaryV7 = $compiler.inject.source("./DevBinaryV7.class.js");
});