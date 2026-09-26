class NodejsFilesystem {

  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TryableInterface,
    ], this);
  }

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

  readFile(fileBrute) {
    const file = $moduler.normalizationOf(fileBrute);
    return require("fs").promises.readFile(file, "utf8");
  }

  writeFile(fileBrute, content) {
    const file = $moduler.normalizationOf(fileBrute);
    return require("fs").promises.writeFile(file, content, "utf8");
  }

  deleteFile(fileBrute) {
    const file = $moduler.normalizationOf(fileBrute);
    return require("fs").promises.unlink(file);
  }

  hasFile(fileBrute) {
    const file = $moduler.normalizationOf(fileBrute);
    return require("fs").promises.lstat(file).then(stat => stat.isFile()).catch(error => false);
  }

  readDirectory(dirBrute) {
    const dir = $moduler.normalizationOf(dirBrute);
    return require("fs").promises.readdir(dir);
  }

  writeDirectory(dirBrute) {
    const dir = $moduler.normalizationOf(dirBrute);
    return require("fs").promises.mkdir(dir);
  }

  deleteDirectory(dirBrute) {
    const dir = $moduler.normalizationOf(dirBrute);
    return require("fs").promises.rm(dir, { recursive: true });
  }

  hasDirectory(dirBrute) {
    const dir = $moduler.normalizationOf(dirBrute);
    return require("fs").promises.lstat(dir).then(stat => stat.isDirectory()).catch(error => false);
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

}