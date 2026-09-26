module.exports = async function ({ Tester }) {
  const { Basedir } = Std.all;

  const target = $moduler.normalizationOf(
    "@/src/www/dev/test/feature/006.Std.classes.Basedir puede resolver rutas de las 3 formas/",
  );

  const resolver = Basedir.create({
    basedir: target,
    rootdir: target,
  });

  const path1 = resolver.normalizationOf("@");
  const path2 = resolver.normalizationOf("@/assets");

  $moduler.assert(
    path1 === `${resolver.rootdir}`,
    "Can normalize rootdir correctly (1)",
  );
  $moduler.assert(
    path2 === `${resolver.rootdir}/assets`,
    "Can normalize rootpaths correctly (2)",
  );
};
