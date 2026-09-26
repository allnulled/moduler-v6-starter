module.exports = $moduler.import([
  "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForNodejs || $compiler.inject.source("./ForNodejs.class.js");
});