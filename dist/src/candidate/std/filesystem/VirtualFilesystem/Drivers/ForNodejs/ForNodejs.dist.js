module.exports = $moduler.import([ "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js" ], function([VirtualFilesystem]) {
  return VirtualFilesystem.Drivers?.ForNodejs || class extends VirtualFilesystem.Drivers.Abstraction {
    static async load() {}
    _normalizePath() {}
    _readFile() {}
    _readDirectory() {}
    _writeFile(params, options) {
      const {file: file, content: content} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      return tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._writeFile", arguments), 
      require("fs").promises.writeFile($moduler.normalizationOf(file), content, "utf8");
    }
    _makeDirectory(params, options) {
      const {directory: directory} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      return tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._makeDirectory", arguments), 
      require("fs").promises.mkdir($moduler.normalizationOf(directory));
    }
    _deleteFile=Object.assign((...args) => {
      const [params, options] = args, {file: file} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      return tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._deleteFile", args), 
      require("fs").promises.unlink($moduler.normalizationOf(file));
    }, {
      onlyTry: (...args) => this.__trify(this.deleteFile, args)
    });
    _deleteDirectory(params, options) {
      const {directory: directory} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      return tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._makeDirectory", arguments), 
      require("fs").promises.rmdir($moduler.normalizationOf(directory));
    }
    _ensureFile() {}
    _ensureDirectory() {}
    async _existsFile(params, options) {
      const {file: file, contents: contents} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory", arguments);
      try {
        return (await require("fs").promises.stat($moduler.normalizationOf(file))).isFile();
      } catch (error) {
        if ("ENOENT" === error.code) return !1;
        throw error;
      }
    }
    async _existsDirectory(params, options) {
      const {directory: directory, contents: contents} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory", arguments);
      try {
        return (await require("fs").promises.stat($moduler.normalizationOf(directory))).isDirectory();
      } catch (error) {
        if ("ENOENT" === error.code) return !1;
        throw error;
      }
    }
    _existsNode(params, settings) {
      const {file: file} = $moduler.toolkit.normalizeParams(params), {tracer: tracer} = $moduler.toolkit.normalizeOptions(options);
      return tracer.log("VirtualFilesystem.Drivers.ForNodejs.prototype._existsNode", arguments), 
      require("fs").promises.access($moduler.normalizationOf(file)).then(() => !0).catch(error => !1);
    }
    _copyFile() {}
    _copyDirectory() {}
    _moveFile() {}
    _moveDirectory() {}
  };
});