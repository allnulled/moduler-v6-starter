module.exports = async function ({ Tester }) {
  const { Rootdir } = Std.all;

  const root = Rootdir.create({
    rootdir: $moduler.normalizationOf(
      "@/src/www/dev/test/feature/006.Std.classes.Rootdir puede resolver rutas de las 3 formas/",
    ),
  });

  const path1 = root.normalizationOf("@");
  const path2 = root.normalizationOf("@/assets");

  $moduler.assert(
    path1 === `${root.rootdir}`,
    "Can normalize rootdir correctly (1)",
  );
  $moduler.assert(
    path2 === `${root.rootdir}/assets`,
    "Can normalize rootpaths correctly (2)",
  );
};
