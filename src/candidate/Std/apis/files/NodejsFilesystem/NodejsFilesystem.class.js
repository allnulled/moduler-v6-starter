class NodejsFilesystem {

  static async mount() {
    // @ASYNC: to polyfill
    return new this();
  }

  constructor() {
    // @EMPTY: just to polyfill
  }

  async mount() {
    // @EMPTY: just to polyfill
  }

  async unmount() {
    // @EMPTY: just to polyfill
  }

  readFile(file) {
    return require("fs").promises.readFile(file, "utf8");
  }

  writeFile(file, content) {
    return require("fs").promises.writeFile(file, content, "utf8");
  }

  deleteFile(file) {
    return require("fs").promises.unlink(file);
  }

  hasFile(file) {
    return require("fs").promises.lstat(file).then(stat => stat.isFile()).catch(error => false);
  }

  readDirectory(dir) {
    return require("fs").promises.readdir(dir);
  }

  writeDirectory(dir) {
    return require("fs").promises.mkdir(dir);
  }

  deleteDirectory(dir) {
    throw new Error("Evitemos, tonterías de estas");
    return require("fs").promises.rmdir(dir, { recursive: true, force: true });
  }

  hasDirectory(dir) {
    return require("fs").promises.lstat(file).then(stat => stat.isDirectory()).catch(error => false);
  }

  async copyFile(src, dst) {
    throw new Error("Not supported yet");
  }

  async copyDirectory(src, dst) {
    throw new Error("Not supported yet");
  }

  async moveFile(src, dst) {
    throw new Error("Not supported yet");
  }

  async moveDirectory(src, dst) {
    throw new Error("Not supported yet");
  }

  static {
    this.trify = Std.functions.trifyAsync;
    this.prototype.readFile.try = this.trify(this.prototype.readFile, this);
    this.prototype.writeFile.try = this.trify(this.prototype.writeFile, this);
    this.prototype.deleteFile.try = this.trify(this.prototype.deleteFile, this);
    this.prototype.readDirectory.try = this.trify(this.prototype.readDirectory, this);
    this.prototype.writeDirectory.try = this.trify(this.prototype.writeDirectory, this);
    this.prototype.deleteDirectory.try = this.trify(this.prototype.deleteDirectory, this);
  }

}