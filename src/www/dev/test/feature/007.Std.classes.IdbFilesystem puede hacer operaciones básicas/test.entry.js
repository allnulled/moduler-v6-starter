module.exports = async function ({ Tester }) {

  return;
  
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
    const files2 = await idbfs.asyncTry.readFile("@/pakaka.kaka");
    $moduler.assert("version" in JSON.parse(files1), "Std.classes.IdbFilesystem can use readFile (1)");
    $moduler.assert(files2 instanceof Error, "Std.classes.IdbFilesystem can use try.readFile (2)");
  }

  Read_directory: {
    await idbfs.asyncTry.deleteDirectory("@/src/kaka");
    const files1 = await idbfs.readDirectory("@");
    const files2 = await idbfs.asyncTry.readDirectory("@/src/kaka");
    $moduler.assert(files1.includes("src"), "Std.classes.IdbFilesystem can use readDirectory (1)");
    $moduler.assert(files2 instanceof Error, "Std.classes.IdbFilesystem can use try.readDirectory (2)");
  }

  Write_has_y_delete_file: {
    const input1 = "@src/www/dev/test/feature/005.Std.classes.IdbFilesystem puede hacer operaciones básicas/asset1.txt";
    const input2 = "@src/www/dev/test/feature/005.Std.classes.IdbFilesystem puede hacer operaciones básicas/impossible/asset2.txt";
    await idbfs.deleteFile(input1);
    const hasFile1Before = await idbfs.hasFile(input1);
    const files1 = await idbfs.writeFile(input1, "whatever");
    const files2 = await idbfs.asyncTry.writeFile(input2, "whatever else");
    const hasFile1After = await idbfs.hasFile(input1);
    $moduler.assert(!hasFile1Before, "Std.classes.IdbFilesystem checks file not exists before writeFile call (1)");
    $moduler.assert(files2 instanceof Error, "Std.classes.IdbFilesystem can use try.writeFile (2)");
    $moduler.assert(hasFile1After, "Std.classes.IdbFilesystem check file exists after writeFile call (3)");
  }

  Write_has_y_delete_directory: {
    const dir1 = "@src/www/dev/test/feature/005.Std.classes.IdbFilesystem puede hacer operaciones básicas/somedir";
    await idbfs.asyncTry.deleteDirectory(dir1);
    const hasDir1Before = await idbfs.hasDirectory(dir1);
    const files1 = await idbfs.writeDirectory(dir1);
    const files2 = await idbfs.asyncTry.writeDirectory("@/src/kaka/davaka");
    const hasDir1After = await idbfs.hasDirectory(dir1);
    $moduler.assert(!hasDir1Before, "Std.classes.IdbFilesystem checks file not exists before writeFile call (1)");
    $moduler.assert(files2 instanceof Error, "Std.classes.IdbFilesystem can use try.writeFile (2)");
    $moduler.assert(hasDir1After, "Std.classes.IdbFilesystem check file exists after writeFile call (3)");
    Clean_directories_and_files: {
      await idbfs.asyncTry.deleteDirectory(dir1);
    }
  }

};