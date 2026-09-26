module.exports = async function ({ Std, devbin }) {

  const { NodejsFilesystem } = Std.all;

  const muter = await devbin.utils.addTouchMutedirTo("@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs");

  try {

    const nfs = new NodejsFilesystem();

    await nfs.mount();

    Read_file: {
      const files1 = await nfs.readFile("@/package.json");
      const files2 = await nfs.asyncTry.readFile("@/pakaka.kaka");
      $moduler.assert("version" in JSON.parse(files1), "Std.classes.NodejsFilesystem can use readFile (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use readFile.try (2)");
    }
    
    Read_directory: {
      const files1 = await nfs.readDirectory("@/");
      const files2 = await nfs.asyncTry.readDirectory("@/src/kaka");
      $moduler.assert(files1.includes("src"), "Std.classes.NodejsFilesystem can use readDirectory (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use readDirectory.try (2)");
    }
    
    Write_has_y_delete_file: {
      const input1 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs/asset1.txt";
      const input2 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs/impossible/asset2.txt";
      await nfs.asyncTry.deleteFile(input1);
      const hasFile1Before = await nfs.hasFile(input1);
      const files1 = await nfs.writeFile(input1, "whatever");
      const files2 = await nfs.asyncTry.writeFile(input2, "whatever else");
      const hasFile1After = await nfs.hasFile(input1);
      $moduler.assert(!hasFile1Before, "Std.classes.NodejsFilesystem checks file not exists before writeFile call (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use writeFile.try (2)");
      $moduler.assert(hasFile1After, "Std.classes.NodejsFilesystem check file exists after writeFile call (3)");
      Clean_directories_and_files: {
        await nfs.asyncTry.deleteFile(input1);
      }
    }
    
    Write_has_y_delete_directory: {
      const dir1 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs/somedir";
      await nfs.asyncTry.deleteDirectory(dir1);
      const hasDir1Before = await nfs.hasDirectory(dir1);
      const files1 = await nfs.writeDirectory(dir1);
      const files2 = await nfs.asyncTry.writeDirectory("@/src/kaka/davaka");
      const hasDir1After = await nfs.hasDirectory(dir1);
      $moduler.assert(!hasDir1Before, "Std.classes.NodejsFilesystem checks file not exists before writeFile call (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use writeFile.try (2)");
      $moduler.assert(hasDir1After, "Std.classes.NodejsFilesystem check file exists after writeFile call (3)");
      Clean_directories_and_files: {
        await nfs.asyncTry.deleteDirectory(dir1);
      }
    }

  } catch (error) {
    throw error;
  } finally {
    await muter.cancel();
  }

};