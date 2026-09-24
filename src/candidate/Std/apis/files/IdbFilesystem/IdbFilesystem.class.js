class IdbFilesystem {

  static async mount() {
    const fs = new this();
    await fs.mount();
    return fs;
  }

  constructor() {
    this.db = null;
    this.crud = null;
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
    return entries.filter((entry) => {
      return entry.type === "file" &&
        entry.path.startsWith(dir + "/");
    });
  }

  async writeDirectory(dir) {
    await this.crud.put("files", {
      path: dir,
      type: "directory",
    });
  }

  async deleteDirectory(dir) {
    const entries = await this.crud.getAll("files");
    const children = entries.filter((entry) => {
      return entry.path === dir ||
        entry.path.startsWith(dir + "/");
    });
    for (const entry of children) {
      await this.crud.delete("files", entry.path);
    }
  }

  async hasDirectory(dir) {
    const entry = await this.crud.get("files", dir);
    return !!entry && entry.type === "directory";
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