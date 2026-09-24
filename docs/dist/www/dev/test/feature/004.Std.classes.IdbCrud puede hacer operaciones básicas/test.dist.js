module.exports = async function ({ Tester }) {
  Tester.start(
    "Tests of Std.classes.IdbFilesystem",
    async function ({ tester, asserter: { assert } }) {
      let fs;

      // mount filesystem
      await tester.case("can mount new filesystem", async function () {
        fs = await Std.classes.IdbFilesystem.mount(); // mount es el new + async load para los filesystems, nodejs no lo usará, pero idb sí
      });

      // file
      await tester.case("can do writeFile", async function () {
        await fs.writeFile("./hello.txt", "ok");
      });

      await tester.case("can do readFile", async function () {
        const text = await fs.readFile("./hello.txt");
        assert(typeof text === "string", "readFile outputs string");
      });

      await tester.case("can do deleteFile and hasFile", async function () {
        assert(
          true === (await fs.hasFile("./hello.txt")),
          "hasFile works with recently created file",
        );
        await fs.deleteFile("./hello.txt");
        assert(
          false === (await fs.hasFile("./hello.txt")),
          "hasFile works with recently deleted file",
        );
      });

      // directory
      await tester.case("can do writeDirectory", async function () {
        await fs.writeDirectory("./lib");
      });

      await tester.case("can do readDirectory", async function () {
        const text = await fs.readDirectory("./lib");
        assert(typeof text === "object", "readDirectory outputs object");
      });

      await tester.case(
        "can do deleteDirectory and hasDirectory",
        async function () {
          assert(
            true === (await fs.hasDirectory("./lib")),
            "hasDirectory works with recently created directory",
          );
          await fs.deleteDirectory("./lib");
          assert(
            false === (await fs.hasDirectory("./lib")),
            "hasDirectory works with recently deleted directory",
          );
        },
      );
    },
  );
};
