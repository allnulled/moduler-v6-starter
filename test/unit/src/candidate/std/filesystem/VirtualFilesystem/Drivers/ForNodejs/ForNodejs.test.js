const devbin = require(__dirname + "/../../../../../../../../../dev/bin.js");
const target = require(__dirname + "/../../../../../../../../../dist/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/ForNodejs.dist.js");

module.exports = (async function () {

  console.log("2.REQUIRE", typeof require);
  const VfsForNodejs = await target;
  console.log("3.REQUIRE", VfsForNodejs);
  const root2 = "test/unit/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs";
  const vfs = VfsForNodejs.create({ basedir: devbin.moduler.normalizationOf("@/test/unit/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/") });
  await vfs.deleteFile.onlyTry(`@/${root2}/things/step-1.txt`);
  await vfs.deleteDirectory.onlyTry(`@/${root2}/things`);
  devbin.assert(!await vfs.existsDirectory(`@/${root2}/things`), "Can use vfs driver for nodejs with makeDirectory (1)");
  devbin.assert(!await vfs.existsFile(`@/${root2}/things/step-1.txt`), "Can use vfs driver for nodejs with writeFile (2)");
  await vfs.makeDirectory(`@/${root2}/things`);
  await vfs.writeFile(`@/${root2}/things/step-1.txt`, "one");
  devbin.assert(await vfs.existsDirectory(`@/${root2}/things`), "Can use vfs driver for nodejs with makeDirectory (3)");
  devbin.assert(await vfs.existsFile(`@/${root2}/things/step-1.txt`), "Can use vfs driver for nodejs with writeFile (4)");
  await vfs.deleteDirectory(`@/${root2}/things`);
  await vfs.deleteFile(`@/${root2}/things`);
  devbin.assert(await vfs.existsDirectory(`@/${root2}/things`), "Can use vfs driver for nodejs with deleteDirectory (5)");
  devbin.assert(await vfs.existsFile(`@/${root2}/things/step-1.txt`), "Can use vfs driver for nodejs with deleteFile (6)");
  devbin.assert(true, "Test is empty right now");

})();