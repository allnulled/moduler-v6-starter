_existsNode (params, settings) {
  /**
   * # prototype._existsNode
   * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._existsNode
   * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._existsNode.js
   */
  const { file } = $moduler.toolkit.normalizeParams(params);
  const { tracer } = $moduler.toolkit.normalizeOptions(options);
  tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._existsNode", arguments);
  return require("fs").promises.access($moduler.normalizationOf(file)).then(() => true).catch((error) => false);
}