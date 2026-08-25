module.exports = $moduler.import(function() {
  return class VirtualFilesystem {
    static assert(condition, message) {
      if (!condition) throw new Error(message);
    }
    static create(...args) {
      return new this(...args);
    }
    static Drivers=class {
      static Vfs=VirtualFilesystem;
      static assert=VirtualFilesystem.assert;
      static Abstraction=class {
        static create(...args) {
          return new this(...args);
        }
        static load() {
          throw new Error(`Method «static.load» must be overriden on class «${this.name}»`);
        }
        normalizePath(node) {
          return this._normalizePath({
            node: node
          });
        }
        readFile(file) {
          return this._readFile({
            file: file
          });
        }
        readDirectory(directory) {
          return this._readDirectory({
            directory: directory
          });
        }
        writeFile(file, content) {
          return this._writeFile({
            file: file,
            content: content
          });
        }
        makeDirectory(directory) {
          return this._makeDirectory({
            directory: directory
          });
        }
        deleteFile=Object.assign(file => this._deleteFile({
          file: file
        }), {
          onlyTry: (...args) => this._deleteFile.onlyTry(...args)
        });
        deleteDirectory(directory) {
          return this._deleteDirectory({
            directory: directory
          });
        }
        ensureFile(file) {
          return this._ensureFile({
            file: file
          });
        }
        ensureDirectory(directory) {
          return this._ensureDirectory({
            directory: directory
          });
        }
        existsFile(file) {
          return this._existsFile({
            file: file
          });
        }
        existsDirectory(directory) {
          return this._existsDirectory({
            directory: directory
          });
        }
        existsNode(node) {
          return this._existsNode({
            node: node
          });
        }
        copyFile(origin, destination) {
          return this._copyFile({
            origin: origin,
            destination: destination
          });
        }
        copyDirectory(origin, destination) {
          return this._copyDirectory({
            origin: origin,
            destination: destination
          });
        }
        moveFile(origin, destination) {
          return this._moveFile({
            origin: origin,
            destination: destination
          });
        }
        moveDirectory(origin, destination) {
          return this._moveDirectory({
            origin: origin,
            destination: destination
          });
        }
        _normalizePath() {
          throw new Error(`Method «normalizePath» must be overriden on class «${this.constructor.name}»`);
        }
        _readFile() {
          throw new Error(`Method «readFile» must be overriden on class «${this.constructor.name}»`);
        }
        _readDirectory() {
          throw new Error(`Method «readDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _writeFile() {
          throw new Error(`Method «writeFile» must be overriden on class «${this.constructor.name}»`);
        }
        _makeDirectory() {
          throw new Error(`Method «makeDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _deleteFile() {
          throw new Error(`Method «deleteFile» must be overriden on class «${this.constructor.name}»`);
        }
        _deleteDirectory() {
          throw new Error(`Method «deleteDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _ensureFile() {
          throw new Error(`Method «ensureDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _ensureDirectory() {
          throw new Error(`Method «ensureDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _existsFile() {
          throw new Error(`Method «existsFile» must be overriden on class «${this.constructor.name}»`);
        }
        _existsDirectory() {
          throw new Error(`Method «existsDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _existsNode() {
          throw new Error(`Method «existsNode» must be overriden on class «${this.constructor.name}»`);
        }
        _copyFile() {
          throw new Error(`Method «copyFile» must be overriden on class «${this.constructor.name}»`);
        }
        _copyDirectory() {
          throw new Error(`Method «copyDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        _moveFile() {
          throw new Error(`Method «moveFile» must be overriden on class «${this.constructor.name}»`);
        }
        _moveDirectory() {
          throw new Error(`Method «moveDirectory» must be overriden on class «${this.constructor.name}»`);
        }
        constructor(basedir = !1) {
          this.basedir = basedir, this.basedir = basedir;
        }
      };
      static load(driverId) {
        this.assert(driverId in this, `«$std.filesystem.VirtualFilesystem.Drivers.load» cannot load driver «${driverId}» because it has not a defined class`);
        const DriverClass = this[driverId];
        return this.assert(DriverClass.prototype instanceof this.Abstraction, `«$std.filesystem.VirtualFilesystem.Drivers.load» cannot accept driver «${driverId}» because it is not a «Vfs.Drivers.Abstraction» class extension`), 
        DriverClass.load();
      }
    };
    static {
      Object.assign(this.Drivers, {
        ForIndexeddb: class extends VirtualFilesystem.Drivers.Abstraction {
          static async load() {
            console.log("Loading driver for indexeddb");
          }
        },
        ForLocalStorage: class extends VirtualFilesystem.Drivers.Abstraction {
          static async load() {
            console.log("Loading driver for localstorage");
          }
        },
        ForNodejs: class extends VirtualFilesystem.Drivers.Abstraction {
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
        },
        ForWebsocketServer: class extends VirtualFilesystem.Drivers.Abstraction {
          static async load() {
            console.log("Loading driver for websocket server");
          }
        },
        ForWebsocketClient: class extends VirtualFilesystem.Drivers.Abstraction {
          static async load() {
            console.log("Loading driver for websocket client");
          }
        }
      });
    }
  };
});