async _existsFile (params, options) {
  /**
   * # prototype._existsFile
   * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._existsFile
   * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._existsFile.js
   */
  const { file, contents } = $moduler.toolkit.normalizeParams(params);
  const { tracer } = $moduler.toolkit.normalizeOptions(options);
  tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory", arguments);
  try {
    const info = await require("fs").promises.stat($moduler.normalizationOf(file));
    return info.isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error; // Otro problema: permisos, I/O, etc.
  }
}