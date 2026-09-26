class VfsDriverAbstraction {

  _copyDirectory() {
    //ok8899
    throw new Error(`Method «copyDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _copyFile() {
    throw new Error(`Method «copyFile» must be overriden on class «${this.constructor.name}»`);
  }

  _deleteDirectory() {
    throw new Error(`Method «deleteDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _deleteFile() {
    throw new Error(`Method «deleteFile» must be overriden on class «${this.constructor.name}»`);
  }

    _ensureDirectory() {
    throw new Error(`Method «ensureDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _ensureFile() {
    throw new Error(`Method «ensureDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _existsDirectory() {
    throw new Error(`Method «existsDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _existsFile() {
    throw new Error(`Method «existsFile» must be overriden on class «${this.constructor.name}»`);
  }

  _existsNode() {
    throw new Error(`Method «existsNode» must be overriden on class «${this.constructor.name}»`);
  }

    _makeDirectory() {
    throw new Error(`Method «makeDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _moveDirectory() {
    throw new Error(`Method «moveDirectory» must be overriden on class «${this.constructor.name}»`);
  }

  _moveFile() {
    throw new Error(`Method «moveFile» must be overriden on class «${this.constructor.name}»`);
  }

  _normalizePath() {
    throw new Error(`Method «normalizePath» must be overriden on class «${this.constructor.name}»`);
  }

  _readDirectory() {
    throw new Error(`Method «readDirectory» must be overriden on class «${this.constructor.name}»`);
  }

    _readFile() {
    throw new Error(`Method «readFile» must be overriden on class «${this.constructor.name}»`);
  }

  _writeFile() {
    throw new Error(`Method «writeFile» must be overriden on class «${this.constructor.name}»`);
  }

  copyDirectory(origin, destination) {
    return this._copyDirectory({ origin, destination });
  }

  copyFile(origin, destination) {
    return this._copyFile({ origin, destination });
  }

  deleteDirectory(directory) {
    return this._deleteDirectory({ directory });
  }

  deleteFile = Object.assign(file => {
    return this._deleteFile({ file });
  }, {
    onlyTry: (...args) => this._deleteFile.onlyTry(...args),
  });

  ensureDirectory(directory) {
    return this._ensureDirectory({ directory });
  }

  ensureFile(file) {
    return this._ensureFile({ file });
  }

  existsDirectory(directory) {
    return this._existsDirectory({ directory });
  }

    existsFile(file) {
    return this._existsFile({ file });
  }

  existsNode(node) {
    return this._existsNode({ node });
  }

  makeDirectory(directory) {
    return this._makeDirectory({ directory });
  }

  moveDirectory(origin, destination) {
    return this._moveDirectory({ origin, destination });
  }

  moveFile(origin, destination) {
    return this._moveFile({ origin, destination });
  }

  normalizePath(node) {
    return this._normalizePath({ node });
  }

  readDirectory(directory) {
    return this._readDirectory({ directory });
  }

    readFile(file) {
    return this._readFile({ file });
  }

    writeFile(file, content) {
    return this._writeFile({ file, content });
  }

}
