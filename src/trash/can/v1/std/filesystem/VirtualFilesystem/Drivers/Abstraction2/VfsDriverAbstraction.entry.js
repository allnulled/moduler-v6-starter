module.exports = $moduler.import([
  "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.Abstraction || $compiler.inject.source("./VfsDriverAbstraction.class.js");
});