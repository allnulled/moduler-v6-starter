module.exports = $moduler.import([
  "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForWebsocketClient || $compiler.inject.source("./ForWebsocketClient.class.js");
});