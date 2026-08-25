module.exports = $moduler.import([ "@/dist/src/candidate/std/filesystem/VirtualFilesystem/VirtualFilesystem.dist.js" ], function([VirtualFilesystem]) {
  return VirtualFilesystem.Drivers?.Abstraction || class {
    static load() {
      throw new Error(`Method «static.load» must be overriden on class «${this.name}»`);
    }
    normalizePath() {
      return this._normalizePath(...arguments);
    }
    readFile() {
      return this._readFile(...arguments);
    }
    readDirectory() {
      return this._readDirectory(...arguments);
    }
    writeFile() {
      return this._writeFile(...arguments);
    }
    makeDirectory() {
      return this._makeDirectory(...arguments);
    }
    deleteFile() {
      return this._deleteFile(...arguments);
    }
    deleteDirectory() {
      return this._deleteDirectory(...arguments);
    }
    ensureFile() {
      return this._ensureFile(...arguments);
    }
    ensureDirectory() {
      return this._ensureDirectory(...arguments);
    }
    existsFile() {
      return this._existsFile(...arguments);
    }
    existsDirectory() {
      return this._existsDirectory(...arguments);
    }
    existsNode() {
      return this._existsNode(...arguments);
    }
    copyFile() {
      throw new Error(`Method «copyFile» must be overriden on class «${this.constructor.name}»`);
    }
    copyDirectory() {
      return this._copyDirectory(...arguments);
    }
    moveFile() {
      return this._moveFile(...arguments);
    }
    moveDirectory() {
      return this._moveDirectory(...arguments);
    }
    normalizePath() {
      throw new Error(`Method «normalizePath» must be overriden on class «${this.constructor.name}»`);
    }
    readFile() {
      throw new Error(`Method «readFile» must be overriden on class «${this.constructor.name}»`);
    }
    readDirectory() {
      throw new Error(`Method «readDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    writeFile() {
      throw new Error(`Method «writeFile» must be overriden on class «${this.constructor.name}»`);
    }
    makeDirectory() {
      throw new Error(`Method «makeDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    deleteFile() {
      throw new Error(`Method «deleteFile» must be overriden on class «${this.constructor.name}»`);
    }
    deleteDirectory() {
      throw new Error(`Method «deleteDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    ensureFile() {
      throw new Error(`Method «ensureDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    ensureDirectory() {
      throw new Error(`Method «ensureDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    existsFile() {
      throw new Error(`Method «existsFile» must be overriden on class «${this.constructor.name}»`);
    }
    existsDirectory() {
      throw new Error(`Method «existsDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    existsNode() {
      throw new Error(`Method «existsNode» must be overriden on class «${this.constructor.name}»`);
    }
    copyFile() {
      throw new Error(`Method «copyFile» must be overriden on class «${this.constructor.name}»`);
    }
    copyDirectory() {
      throw new Error(`Method «copyDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    moveFile() {
      throw new Error(`Method «moveFile» must be overriden on class «${this.constructor.name}»`);
    }
    moveDirectory() {
      throw new Error(`Method «moveDirectory» must be overriden on class «${this.constructor.name}»`);
    }
    constructor(basedir = !1) {
      this.basedir = basedir, this.basedir = basedir;
    }
  };
});