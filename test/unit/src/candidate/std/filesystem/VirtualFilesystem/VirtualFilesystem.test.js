const devbin = require(__dirname + "/../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js");

module.exports = (async function () {

  const Vfs = await target;
  await Vfs.Drivers.load("ForLocalStorage");
  await Vfs.Drivers.load("ForIndexeddb");
  await Vfs.Drivers.load("ForNodejs");
  await Vfs.Drivers.load("ForWebsocketClient");
  await Vfs.Drivers.load("ForWebsocketServer");
  await devbin.compiler.assertThrows(async () => await Vfs.Drivers.load("Another thing"), "Should fail on loading missing driver");
  devbin.assert(true, "Test is empty right now");

})();