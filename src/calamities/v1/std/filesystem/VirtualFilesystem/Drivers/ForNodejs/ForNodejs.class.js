class VfsDriverForNodejs extends VirtualFilesystem.Drivers.Abstraction {
  static async load() {
    // @OK empty is ok for nodejs driver.
  }
  /*@injects:"./prototype._normalizePath.js"*/
  /*@injects:"./prototype._readFile.js"*/
  /*@injects:"./prototype._readDirectory.js"*/
  /*@injects:"./prototype._writeFile.js"*/
  /*@injects:"./prototype._makeDirectory.js"*/
  /*@injects:"./prototype._deleteFile.js"*/
  /*@injects:"./prototype._deleteDirectory.js"*/
  /*@injects:"./prototype._ensureFile.js"*/
  /*@injects:"./prototype._ensureDirectory.js"*/
  /*@injects:"./prototype._existsFile.js"*/
  /*@injects:"./prototype._existsDirectory.js"*/
  /*@injects:"./prototype._existsNode.js"*/
  /*@injects:"./prototype._copyFile.js"*/
  /*@injects:"./prototype._copyDirectory.js"*/
  /*@injects:"./prototype._moveFile.js"*/
  /*@injects:"./prototype._moveDirectory.js"*/
}