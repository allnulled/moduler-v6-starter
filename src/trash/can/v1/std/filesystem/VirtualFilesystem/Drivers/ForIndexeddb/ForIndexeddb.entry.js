module.exports = $moduler.import([
  "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForIndexeddb || $compiler.inject.source("./ForIndexeddb.class.js");
});