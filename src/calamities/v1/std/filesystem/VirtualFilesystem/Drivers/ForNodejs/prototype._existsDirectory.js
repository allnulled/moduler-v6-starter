async _existsDirectory (params, options) {
  /**
   * # prototype._existsDirectory
   * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory
   * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._existsDirectory.js
   */
  const { directory, contents } = $moduler.toolkit.normalizeParams(params);
  const { tracer } = $moduler.toolkit.normalizeOptions(options);
  tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory", arguments);
  try {
    const info = await require("fs").promises.stat($moduler.normalizationOf(directory));
    return info.isDirectory();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error; // Otro problema: permisos, I/O, etc.
  }
}