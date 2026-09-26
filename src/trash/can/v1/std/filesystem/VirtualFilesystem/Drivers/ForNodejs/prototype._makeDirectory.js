_makeDirectory (params, options) {
  const { directory } = $moduler.toolkit.normalizeParams(params);
  const { tracer } = $moduler.toolkit.normalizeOptions(options);
  tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._makeDirectory", arguments);
  return require("fs").promises.mkdir($moduler.normalizationOf(directory));
}