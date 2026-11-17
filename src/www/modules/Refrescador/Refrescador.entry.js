(async function() {
  const Refrescador = await $compiler.inject.plainModule("@/src/external/refrescador/refrescador.api.dist.js")
  Std.externals.Colors = Refrescador.colors;
  Std.externals.Refrescador = Refrescador;
  return Refrescador;
})()