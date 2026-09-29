module.exports = async function ({ Tester }) {
  const { IdbFilesystem } = Std.all;

  const idbfs = new IdbFilesystem();

  await idbfs.mount();

  Prepare: {
    await idbfs.writeDirectory("@");
    await idbfs.writeFile("@/package.json", JSON.stringify({ version: "1.0" }));
    await idbfs.writeDirectory("@/src");
  }

  Read_file: {
    const files1 = await idbfs.readFile("@/package.json");
    const files2 = await idbfs.try.readFile("@/pakaka.kaka");
    $moduler.assert(
      "version" in JSON.parse(files1),
      "Std.classes.IdbFilesystem can use readFile (1)",
    );
    $moduler.assert(
      files2 instanceof Error,
      "Std.classes.IdbFilesystem can use try.readFile (2)",
    );
  }

  Read_directory: {
    await idbfs.try.deleteDirectory("@/src/kaka");
    const files1 = await idbfs.readDirectory("@");
    const files2 = await idbfs.try.readDirectory("@/src/kaka");
    $moduler.assert(
      files1.includes("src"),
      "Std.classes.IdbFilesystem can use readDirectory (1)",
    );
    $moduler.assert(
      files2 instanceof Error,
      "Std.classes.IdbFilesystem can use try.readDirectory (2)",
    );
  }

  Write_has_y_delete_file: {
    const input1 = "@/src/asset1.txt";
    const input2 = "@/src/impossible/asset2.txt";
    await idbfs.try.deleteFile(input1);
    const hasFile1Before = await idbfs.hasFile(input1);
    const files1 = await idbfs.writeFile(input1, "whatever");
    const files2 = await idbfs.try.writeFile(input2, "whatever else");
    const hasFile1After = await idbfs.hasFile(input1);
    $moduler.assert(
      !hasFile1Before,
      "Std.classes.IdbFilesystem checks file not exists before writeFile call (1)",
    );
    $moduler.assert(
      files2 instanceof Error,
      "Std.classes.IdbFilesystem can use try.writeFile (2)",
    );
    $moduler.assert(
      hasFile1After,
      "Std.classes.IdbFilesystem check file exists after writeFile call (3)",
    );
  }

  Write_has_y_delete_directory: {
    const dir1 = "@/src/somedir";
    await idbfs.try.deleteDirectory(dir1);
    const hasDir1Before = await idbfs.hasDirectory(dir1);
    const files1 = await idbfs.writeDirectory(dir1);
    const files2 = await idbfs.try.writeDirectory("@/src/kaka/davaka");
    const hasDir1After = await idbfs.hasDirectory(dir1);
    $moduler.assert(
      !hasDir1Before,
      "Std.classes.IdbFilesystem checks file not exists before writeDirectory call (1)",
    );
    $moduler.assert(
      files2 instanceof Error,
      "Std.classes.IdbFilesystem can use try.writeDirectory (2)",
    );
    $moduler.assert(
      hasDir1After,
      "Std.classes.IdbFilesystem check file exists after writeDirectory call (3)",
    );
    Clean_directories_and_files: {
      await idbfs.try.deleteDirectory(dir1);
    }
  }

  Copy_and_move_file: {
    const file1 = "@/src/copysrc.txt";
    const file2 = "@/src/copydst.txt";
    const file3 = "@/impossible/copydst.txt";
    const file4 = "@/src/copydst2.txt";
    Reset: {
      await idbfs.try.deleteFile(file1);
      await idbfs.try.deleteFile(file2);
      await idbfs.try.deleteFile(file3);
      await idbfs.try.deleteFile(file4);
    }
    Copy: {
      await idbfs.try.writeFile(file1, "one");
      await idbfs.copyFile(file1, file2);
      const err1 = await idbfs.try.copyFile(file1, file3);
      $moduler.assert(await idbfs.hasFile(file2), "Can copy file");
      $moduler.assert(
        err1 instanceof Error,
        "Can try to copy file but fail if destination has no directory",
      );
    }
    Move: {
      $moduler.assert(!(await idbfs.hasFile(file4)));
      await idbfs.moveFile(file2, file4);
      $moduler.assert(await idbfs.hasFile(file4), "Can move files (1)");
      $moduler.assert(!(await idbfs.hasFile(file2)), "Can move files (2)");
      await idbfs.try.moveFile(file4, file3);
      $moduler.assert(await idbfs.hasFile(file4), "Can try to move files (5)");
      $moduler.assert(
        !(await idbfs.hasFile(file3)),
        "Can try to move files (6)",
      );
    }
  }

  Copy_and_move_directory: {
    const dir1 = "@/src/dir1";
    const dir2 = "@/src/dir2";
    const dir3 = "@/src/dir3";
    const dir4 = "@/src/impossible/dir4";
    Reset: {
      await idbfs.try.deleteDirectory(dir1);
      await idbfs.try.deleteDirectory(dir2);
      await idbfs.try.deleteDirectory(dir3);
    }
    Copy: {
      await idbfs.writeDirectory(dir1);
      await idbfs.writeDirectory(`${dir1}/abc`);
      await idbfs.writeFile(`${dir1}/abc/file.txt`, "ok");
      await idbfs.writeDirectory(`${dir1}/def`);
      await idbfs.writeFile(`${dir1}/def/file.txt`, "reok");
      $moduler.assert(
        false === (await idbfs.hasFile(`${dir2}/abc/file.txt`)),
        "Can prepare copyDirectory test (1)",
      );
      await idbfs.copyDirectory(dir1, dir2);
      $moduler.assert(
        true === (await idbfs.hasFile(`${dir2}/abc/file.txt`)),
        "Can copyDirectory (2)",
      );
      $moduler.assert(
        false === (await idbfs.hasFile(`${dir4}/abc/file.txt`)),
        "Can prepare try.copyDirectory test (3)",
      );
      await idbfs.try.copyDirectory(dir1, dir4);
      $moduler.assert(
        false === (await idbfs.hasFile(`${dir4}/abc/file.txt`)),
        "Can prepare try.copyDirectory test (4)",
      );
    }
    Move: {
      $moduler.assert(
        false === (await idbfs.hasFile(`${dir3}/abc/file.txt`)),
        "Can prepare moveDirectory test (8)",
      );
      $moduler.assert(
        true === (await idbfs.hasFile(`${dir2}/abc/file.txt`)),
        "Can prepare moveDirectory test (9)",
      );
      await idbfs.moveDirectory(dir2, dir3);
      $moduler.assert(
        false === (await idbfs.hasFile(`${dir2}/abc/file.txt`)),
        "Can moveDirectory (11)",
      );
      $moduler.assert(
        true === (await idbfs.hasFile(`${dir3}/abc/file.txt`)),
        "Can moveDirectory (12)",
      );
      await idbfs.try.moveDirectory(dir3, dir4);
      $moduler.assert(
        false === (await idbfs.hasFile(`${dir4}/abc/file.txt`)),
        "Can try.moveDirectory (14)",
      );
      $moduler.assert(
        true === (await idbfs.hasFile(`${dir3}/abc/file.txt`)),
        "Can try.moveDirectory (15)",
      );
    }
  }
};
