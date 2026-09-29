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

  async assertParentDirectory(nodeBrute, appendix = false) {

    const node = $moduler.normalizationOf(nodeBrute);
    const parts = node.split(require("path").sep);

    if (parts.length === 1) return true;

    parts.pop();

    const parent = parts.join(require("path").sep);

    if (await this.hasDirectory(parent)) return true;

    throw new Error(
      `Required «${node}» to have an existing directory${appendix ? " " + appendix : ""}`
    );

  }

  async copyFile(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await this.assertParentDirectory(dst, "on «NodejsFilesystem.prototype.copyFile»");
    await require("fs").promises.copyFile(src, dst);
    return true;
  }

  async copyDirectory(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await this.assertParentDirectory(dst, "on «NodejsFilesystem.prototype.copyDirectory»");
    await require("fs").promises.cp(src, dst, {
      recursive: true,
    });
    return true;
  }

  async moveFile(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await this.assertParentDirectory(dst, "on «NodejsFilesystem.prototype.moveFile»");
    await require("fs").promises.rename(src, dst);
    return true;
  }

  async moveDirectory(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await this.assertParentDirectory(dst, "on «NodejsFilesystem.prototype.moveDirectory»");
    await require("fs").promises.rename(src, dst);
    return true;

  }

  /*
  async copyFile(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await require("fs").promises.copyFile(src, dst);
    return true;
  }

  async copyDirectory(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await require("fs").promises.cp(src, dst, {
      recursive: true,
    });
    return true;
  }

  async moveFile(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await require("fs").promises.rename(src, dst);
    return true;
  }

  async moveDirectory(srcBrute, dstBrute) {
    const src = $moduler.normalizationOf(srcBrute);
    const dst = $moduler.normalizationOf(dstBrute);
    await require("fs").promises.rename(src, dst);
    return true;
  }
  //*/

}