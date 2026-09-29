module.exports = async function ({ Std, devbin }) {

  const { NodejsFilesystem } = Std.all;

  const muter = await devbin.utils.addTouchMutedirTo("@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs");

  try {

    const nfs = new NodejsFilesystem();

    await nfs.mount();

    Read_file: {
      const files1 = await nfs.readFile("@/package.json");
      const files2 = await nfs.try.readFile("@/pakaka.kaka");
      $moduler.assert("version" in JSON.parse(files1), "Std.classes.NodejsFilesystem can use readFile (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use readFile.try (2)");
    }

    Read_directory: {
      const files1 = await nfs.readDirectory("@/");
      const files2 = await nfs.try.readDirectory("@/src/kaka");
      $moduler.assert(files1.includes("src"), "Std.classes.NodejsFilesystem can use readDirectory (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use readDirectory.try (2)");
    }

    Write_has_y_delete_file: {
      const input1 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs/asset1.txt";
      const input2 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs/impossible/asset2.txt";
      await nfs.try.deleteFile(input1);
      const hasFile1Before = await nfs.hasFile(input1);
      const files1 = await nfs.writeFile(input1, "whatever");
      const files2 = await nfs.try.writeFile(input2, "whatever else");
      const hasFile1After = await nfs.hasFile(input1);
      $moduler.assert(!hasFile1Before, "Std.classes.NodejsFilesystem checks file not exists before writeFile call (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use writeFile.try (2)");
      $moduler.assert(hasFile1After, "Std.classes.NodejsFilesystem check file exists after writeFile call (3)");
      Clean_directories_and_files: {
        await nfs.try.deleteFile(input1);
      }
    }

    Write_has_y_delete_directory: {
      const dir1 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs/somedir";
      await nfs.try.deleteDirectory(dir1);
      const hasDir1Before = await nfs.hasDirectory(dir1);
      const files1 = await nfs.writeDirectory(dir1);
      const files2 = await nfs.try.writeDirectory("@/src/kaka/davaka");
      const hasDir1After = await nfs.hasDirectory(dir1);
      $moduler.assert(!hasDir1Before, "Std.classes.NodejsFilesystem checks file not exists before writeFile call (1)");
      $moduler.assert(files2 instanceof Error, "Std.classes.NodejsFilesystem can use writeFile.try (2)");
      $moduler.assert(hasDir1After, "Std.classes.NodejsFilesystem check file exists after writeFile call (3)");
      Clean_directories_and_files: {
        await nfs.try.deleteDirectory(dir1);
      }
    }

    const basedir1 = "@/test/unit/src/candidate/Std/v1/007.Std.classes.Filesystem puede usar el driver de nodejs";

    Copy_and_move_file: {
      await nfs.try.writeDirectory(`${basedir1}/src`);
      const file1 = `${basedir1}/src/copysrc.txt`;
      const file2 = `${basedir1}/src/copydst.txt`;
      const file3 = `${basedir1}/impossible/copydst.txt`;
      const file4 = `${basedir1}/src/copydst2.txt`;
      Reset: {
        await nfs.try.deleteFile(file1);
        await nfs.try.deleteFile(file2);
        await nfs.try.deleteFile(file3);
        await nfs.try.deleteFile(file4);
      }
      Copy: {
        await nfs.try.writeFile(file1, "one");
        await nfs.copyFile(file1, file2);
        const err1 = await nfs.try.copyFile(file1, file3);
        $moduler.assert(await nfs.hasFile(file2), "Can copy file");
        $moduler.assert(err1 instanceof Error, "Can try to copy file but fail if destination has no directory");
      }
      Move: {
        $moduler.assert(!await nfs.hasFile(file4));
        await nfs.moveFile(file2, file4);
        $moduler.assert(await nfs.hasFile(file4), "Can move files (1)");
        $moduler.assert(!await nfs.hasFile(file2), "Can move files (2)");
        await nfs.try.moveFile(file4, file3);
        $moduler.assert(await nfs.hasFile(file4), "Can try to move files (5)");
        $moduler.assert(!await nfs.hasFile(file3), "Can try to move files (6)");
      }
    }

    Copy_and_move_directory: {
      const dir1 = `${basedir1}/src/dir1`;
      const dir2 = `${basedir1}/src/dir2`;
      const dir3 = `${basedir1}/src/dir3`;
      const dir4 = `${basedir1}/src/impossible/dir4`;
      Reset: {
        await nfs.try.deleteDirectory(dir1);
        await nfs.try.deleteDirectory(dir2);
        await nfs.try.deleteDirectory(dir3);
      }
      Copy: {
        await nfs.writeDirectory(dir1);
        await nfs.writeDirectory(`${dir1}/abc`);
        await nfs.writeFile(`${dir1}/abc/file.txt`, "ok");
        await nfs.writeDirectory(`${dir1}/def`);
        await nfs.writeFile(`${dir1}/def/file.txt`, "reok");
        $moduler.assert(false === await nfs.hasFile(`${dir2}/abc/file.txt`), "Can prepare copyDirectory test (1)");
        await nfs.copyDirectory(dir1, dir2);
        $moduler.assert(true === await nfs.hasFile(`${dir2}/abc/file.txt`), "Can copyDirectory (2)");
        $moduler.assert(false === await nfs.hasFile(`${dir4}/abc/file.txt`), "Can prepare try.copyDirectory test (3)");
        await nfs.try.copyDirectory(dir1, dir4);
        $moduler.assert(false === await nfs.hasFile(`${dir4}/abc/file.txt`), "Can prepare try.copyDirectory test (4)");
      }
      Move: {
        $moduler.assert(false === await nfs.hasFile(`${dir3}/abc/file.txt`), "Can prepare moveDirectory test (8)");
        $moduler.assert(true === await nfs.hasFile(`${dir2}/abc/file.txt`), "Can prepare moveDirectory test (9)");
        await nfs.moveDirectory(dir2, dir3);
        $moduler.assert(false === await nfs.hasFile(`${dir2}/abc/file.txt`), "Can moveDirectory (11)");
        $moduler.assert(true === await nfs.hasFile(`${dir3}/abc/file.txt`), "Can moveDirectory (12)");
        await nfs.try.moveDirectory(dir3, dir4);
        $moduler.assert(false === await nfs.hasFile(`${dir4}/abc/file.txt`), "Can try.moveDirectory (14)");
        $moduler.assert(true === await nfs.hasFile(`${dir3}/abc/file.txt`), "Can try.moveDirectory (15)");
      }
    }

  } catch (error) {
    throw error;
  } finally {
    await muter.cancel();
  }

};