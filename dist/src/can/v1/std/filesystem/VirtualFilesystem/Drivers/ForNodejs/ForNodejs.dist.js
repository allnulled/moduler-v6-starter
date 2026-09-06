module.exports = $moduler.import(
  [
    "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js",
  ],
  function ([VirtualFilesystem]) {
    return (
      VirtualFilesystem.Drivers?.ForNodejs ||
      class VfsDriverForNodejs extends VirtualFilesystem.Drivers.Abstraction {
        static async load() {
          // @OK empty is ok for nodejs driver.
        }
        _normalizePath() {
          /**
           * # prototype._normalizePath
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._normalizePath
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._normalizePath.js
           */
        }
        _readFile() {
          /**
           * # prototype._readFile
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._readFile
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._readFile.js
           */
        }
        _readDirectory() {
          /**
           * # prototype._readDirectory
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._readDirectory
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._readDirectory.js
           */
        }
        _writeFile(params, options) {
          const { file, content } = $moduler.toolkit.normalizeParams(params);
          const { tracer } = $moduler.toolkit.normalizeOptions(options);
          tracer.log(
            "VirtualFilesystem.Drivers.ForNodejs.prototype._writeFile",
            arguments,
          );
          return require("fs").promises.writeFile(
            $moduler.normalizationOf(file),
            content,
            "utf8",
          );
        }
        _makeDirectory(params, options) {
          const { directory } = $moduler.toolkit.normalizeParams(params);
          const { tracer } = $moduler.toolkit.normalizeOptions(options);
          tracer.log(
            "VirtualFilesystem.Drivers.ForNodejs.prototype._makeDirectory",
            arguments,
          );
          return require("fs").promises.mkdir(
            $moduler.normalizationOf(directory),
          );
        }
        _deleteFile = Object.assign(
          (...args) => {
            const [params, options] = args;
            const { file } = $moduler.toolkit.normalizeParams(params);
            const { tracer } = $moduler.toolkit.normalizeOptions(options);
            // @ESTAMOSAQUI
            tracer.log(
              "VirtualFilesystem.Drivers.ForNodejs.prototype._deleteFile",
              args,
            );
            return require("fs").promises.unlink(
              $moduler.normalizationOf(file),
            );
          },
          {
            onlyTry: (...args) => {
              return this.__trify(this.deleteFile, args);
            },
          },
        );
        _deleteDirectory(params, options) {
          const { directory } = $moduler.toolkit.normalizeParams(params);
          const { tracer } = $moduler.toolkit.normalizeOptions(options);
          tracer.log(
            "VirtualFilesystem.Drivers.ForNodejs.prototype._makeDirectory",
            arguments,
          );
          return require("fs").promises.rmdir(
            $moduler.normalizationOf(directory),
          );
        }
        _ensureFile() {
          /**
           * # prototype._ensureFile
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._ensureFile
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._ensureFile.js
           */
        }
        _ensureDirectory() {
          /**
           * # prototype._ensureDirectory
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._ensureDirectory
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._ensureDirectory.js
           */
        }
        async _existsFile(params, options) {
          /**
           * # prototype._existsFile
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._existsFile
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._existsFile.js
           */
          const { file, contents } = $moduler.toolkit.normalizeParams(params);
          const { tracer } = $moduler.toolkit.normalizeOptions(options);
          tracer.log(
            "VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory",
            arguments,
          );
          try {
            const info = await require("fs").promises.stat(
              $moduler.normalizationOf(file),
            );
            return info.isFile();
          } catch (error) {
            if (error.code === "ENOENT") return false;
            throw error; // Otro problema: permisos, I/O, etc.
          }
        }
        async _existsDirectory(params, options) {
          /**
           * # prototype._existsDirectory
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._existsDirectory.js
           */
          const { directory, contents } =
            $moduler.toolkit.normalizeParams(params);
          const { tracer } = $moduler.toolkit.normalizeOptions(options);
          tracer.log(
            "VirtualFilesystem.Drivers.ForNodejs.prototype._existsDirectory",
            arguments,
          );
          try {
            const info = await require("fs").promises.stat(
              $moduler.normalizationOf(directory),
            );
            return info.isDirectory();
          } catch (error) {
            if (error.code === "ENOENT") return false;
            throw error; // Otro problema: permisos, I/O, etc.
          }
        }
        _existsNode(params, settings) {
          /**
           * # prototype._existsNode
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._existsNode
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._existsNode.js
           */
          const { file } = $moduler.toolkit.normalizeParams(params);
          const { tracer } = $moduler.toolkit.normalizeOptions(options);
          tracer.log(
            "VirtualFilesystem.Drivers.ForNodejs.prototype._existsNode",
            arguments,
          );
          return require("fs")
            .promises.access($moduler.normalizationOf(file))
            .then(() => true)
            .catch((error) => false);
        }
        _copyFile() {
          /**
           * # prototype._copyFile
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._copyFile
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._copyFile.js
           */
        }
        _copyDirectory() {
          /**
           * # prototype._copyDirectory
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._copyDirectory
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._copyDirectory.js
           */
        }
        _moveFile() {
          /**
           * # prototype._moveFile
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._moveFile
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._moveFile.js
           */
        }
        _moveDirectory() {
          /**
           * # prototype._moveDirectory
           * - section: std.filesystem.VirtualFilesystem.Drivers.ForNodejs.prototype._moveDirectory
           * - file:    @/src/candidate/std/filesystem/VirtualFilesystem/Drivers/ForNodejs/prototype._moveDirectory.js
           */
        }
      }
    );
  },
);
