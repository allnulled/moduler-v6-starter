module.exports = $moduler.import([
  "@/dist/src/Std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForLocalStorage || $compiler.inject.source("./ForLocalStorage.class.js");
});