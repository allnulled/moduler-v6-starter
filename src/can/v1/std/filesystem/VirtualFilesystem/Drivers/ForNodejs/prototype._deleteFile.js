_deleteFile = Object.assign((...args) => {
  const [ params, options ] = args;
  const { file } = $moduler.toolkit.normalizeParams(params);
  const { tracer } = $moduler.toolkit.normalizeOptions(options);
  // @ESTAMOSAQUI
  tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._deleteFile", args);
  return require("fs").promises.unlink($moduler.normalizationOf(file));
}, {
  onlyTry: (...args) => {
    return this.__trify(this.deleteFile, args);
  }
});