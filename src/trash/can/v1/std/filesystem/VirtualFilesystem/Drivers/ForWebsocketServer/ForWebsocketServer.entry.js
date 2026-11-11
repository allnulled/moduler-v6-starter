module.exports = $moduler.import([
  "@/dist/src/Std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js"
], function([ VirtualFilesystem ]) {
  return VirtualFilesystem.Drivers?.ForWebsocketServer || $compiler.inject.source("./ForWebsocketServer.class.js");
});