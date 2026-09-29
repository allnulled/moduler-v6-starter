class IdbFilesystem {

  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
      Std.interfaces.TryableInterface,
    ], this);
  }

  static async mount() {
    const fs = new this();
    await fs.mount();
    return fs;
  }

  constructor() {
    this.db = null;
    this.crud = null;
  }

  basenameOf(path) {
    return path.split("/").filter(it => !!it).pop();
  }

  async mount() {
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("StdIdbFilesystem", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", {
            keyPath: "path",
          });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    this.crud = new Std.classes.IdbCrud(this.db);
  }

  async unmount() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.crud = null;
    }
  }

  async readFile(file) {
    const entry = await this.crud.get("files", file);
    if (!entry || entry.type !== "file") {
      throw new Error(`File not found: ${file}`);
    }
    return entry.content;
  }

  async writeFile(file, content) {
    await this.assertParentDirectory(file, "on «IdbFilesystem.prototype.writeFile»");
    await this.crud.put("files", {
      path: file,
      type: "file",
      content,
    });
  }

  async deleteFile(file) {
    const entry = await this.crud.get("files", file);
    if (!entry || entry.type !== "file") {
      throw new Error(`File not found: ${file}`);
    }
    await this.crud.delete("files", file);
  }

  async hasFile(file) {
    const entry = await this.crud.get("files", file);
    return !!entry && entry.type === "file";
  }

  async readDirectory(dir) {
    const entries = await this.crud.getAll("files");
    const nodes = entries.filter((entry) => {
      const isSubdir = entry.path.startsWith(dir + "/");
      if (!isSubdir) return false;
      const extraPath = entry.path.replace(dir + "/", "");
      const isImmediate = extraPath.match(/\//g) === null;
      if (!isImmediate) return false;
      const isItself = extraPath.length === 0;
      if (isItself) return false;
      return isSubdir && isImmediate && !isItself;
    }).map(entry => this.basenameOf(entry.path));
    if ((nodes.length === 0) && (!await this.hasDirectory(dir))) {
      throw new Error(`IdbFilesystem.prototype.readDirectory cannot read directory because does not exist: ${dir}`);
    }
    return nodes;
  }

  async writeDirectory(dir) {
    await this.assertParentDirectory(dir, "on «IdbFilesystem.prototype.writeDirectory»");
    await this.crud.put("files", {
      path: dir,
      type: "directory",
    });
  }

  async deleteDirectory(dir) {
    const entries = await this.crud.getAll("files");
    const children = entries.filter((entry) => {
      return entry.path === dir || entry.path.startsWith(dir + "/");
    });
    for (const entry of children) {
      await this.crud.delete("files", entry.path);
    }
  }

  async hasDirectory(dir) {
    const entry = await this.crud.get("files", dir);
    return !!entry && entry.type === "directory";
  }

  async hasParentDirectory(node, rootsOk = true) {
    const parts = node.split("/");
    if (parts.length === 1 && rootsOk) return true;
    parts.pop();
    const supernode = parts.join("/");
    if (supernode === node) return rootsOk;
    return await this.hasDirectory(supernode);
  }

  async assertParentDirectory(node, appendix = false) {
    const has = await this.hasParentDirectory(node);
    if (has) return true;
    throw new Error(`Required «${node}» to have an existing directory${appendix ? ' ' + appendix : ''}`);
  }

  async copyFile(src, dst) {
    await this.assertParentDirectory(dst, "on «IdbFilesystem.prototype.copyFile»");
    const contents = await this.readFile(src);
    await this.writeFile(dst, contents);
    return true;
  }

  async moveFile(src, dst) {
    await this.assertParentDirectory(dst, "on «IdbFilesystem.prototype.copyFile»");
    const contents = await this.readFile(src);
    await this.writeFile(dst, contents);
    await this.deleteFile(src);
    return true;
  }

  async copyDirectory(src, dst) {
    await this.assertParentDirectory(dst, "on «IdbFilesystem.prototype.copyDirectory»");
    if (!await this.hasDirectory(src)) {
      throw new Error(`Directory not found: ${src}`);
    }
    const entries = await this.crud.getAll("files");
    const children = entries.filter((entry) => {
      return entry.path === src || entry.path.startsWith(src + "/");
    });
    for (const entry of children) {
      const path = dst + entry.path.slice(src.length);
      await this.crud.put("files", {
        ...entry,
        path,
      });
    }
    return true;
  }

  async moveDirectory(src, dst) {
    await this.assertParentDirectory(dst, "on «IdbFilesystem.prototype.moveDirectory»");
    await this.copyDirectory(src, dst);
    await this.deleteDirectory(src);
    return true;
  }

}