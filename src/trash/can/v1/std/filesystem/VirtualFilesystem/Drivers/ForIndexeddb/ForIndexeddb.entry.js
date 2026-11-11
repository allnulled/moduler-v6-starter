module.exports = $moduler.import([
  "@/dist/src/Std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForIndexeddb || $compiler.inject.source("./ForIndexeddb.class.js");
});