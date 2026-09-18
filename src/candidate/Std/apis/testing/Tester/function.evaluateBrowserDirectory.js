async function evaluateBrowserDirectory({ directory }) {
  await $moduler.settings.load();
  const hasDirectory = directory in ($moduler.settings.data?.browser?.test?.directories || {});
  $moduler.assert(hasDirectory, `Required parameter «options.directory» to exists as key in «$moduler.settings.data.browser.test.directories» but «${directory}» was found instead on «Tester.evaluateBrowserDirectory»`);
  const dirs = $moduler.settings.data.browser.test.directories;
  const ids = Object.keys(dirs);
  Iterating_collections:
  for(let indexCollection=0; indexCollection<ids.length; indexCollection++) {
    const id = ids[indexCollection];
    const { files } = dirs[id];
    if(files.length === 0) continue Iterating_collections;
    Std.objects.Ansi.style("blackBright,bold").print(`[*] ModulerV6 is starting test collection with ${files.length} files of: ${id}`);
    for(let indexTest=0; indexTest<files.length; indexTest++) {
      const testPath = files[indexTest];
      Std.objects.Ansi.style("blackBright,bold").print(`[*] ModulerV6 is importing test of: ${testPath}`);
      await $moduler.import(testPath);
    }
  }
}