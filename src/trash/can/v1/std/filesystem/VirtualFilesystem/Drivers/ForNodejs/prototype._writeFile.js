_writeFile (params, options) {
  const { file, content } = $moduler.toolkit.normalizeParams(params);
  const { tracer } = $moduler.toolkit.normalizeOptions(options);
  tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._writeFile", arguments);
  return require("fs").promises.writeFile($moduler.normalizationOf(file), content, "utf8");
}