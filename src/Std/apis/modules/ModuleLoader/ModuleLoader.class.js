class ModuleLoader {
  static loaders = {
    CompilerV7: () => $moduler.import("@/dist/www/modules/CompilerV7/CompilerV7.dist.js"),
    DevBinaryV7: () => $moduler.import("@/dist/www/modules/DevBinaryV7/DevBinaryV7.dist.js"),
    Refrescador: () => $moduler.import("@/dist/www/modules/Refrescador/Refrescador.dist.js"),
  };
  static load(id) {
    $moduler.assert(id in this.loaders, `Module «${id}» has not a loader candidate on «ModuleLoader.load»`);
    return this.loaders[id]();
  }
}