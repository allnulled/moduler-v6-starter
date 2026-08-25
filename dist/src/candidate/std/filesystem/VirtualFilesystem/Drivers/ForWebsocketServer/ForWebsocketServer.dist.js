module.exports = $moduler.import([ "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js" ], function([VirtualFilesystem]) {
  return VirtualFilesystem.Drivers?.ForWebsocketServer || class extends VirtualFilesystem.Drivers.Abstraction {
    static async load() {
      console.log("Loading driver for websocket server");
    }
  };
});