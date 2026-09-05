module.exports = $moduler.import([
  "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForLocalStorage || $compiler.inject.source("./ForLocalStorage.class.js");
});