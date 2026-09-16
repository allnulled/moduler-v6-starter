module.exports = $moduler.export("#Std", [
  "@/src/external/pegjs/peggyjs.object.js"
], function([peggyjs]) {
  return $compiler.inject.source("./Std.object.js");
});