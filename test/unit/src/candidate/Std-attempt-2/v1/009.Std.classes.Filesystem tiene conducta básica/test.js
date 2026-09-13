module.exports = async function({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;
  const { Filesystem } = Std.all;

  return;

  const fs = Filesystem.ForNodejs.new.config({ basedir: "", rootdir: "" });

  fs.setBasedir(__dirname);
  fs.setRootdir(__dirname);

  assert(await fs.readFile("@/assets/README.md") === "Hello", "")

}