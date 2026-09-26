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
    Esto_es_para_imitar_a_nodejs: {
      await this.crud.get("files", Std.classes.Basedir.superiorPathOf(file));
    }
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
    const selection = entries.filter((entry) => {
      La_condicion_buena_seria_esta: {
        break La_condicion_buena_seria_esta;
        return entry.type === "file" &&
        entry.path.startsWith(dir + "/");
      }
      Pero_esta_es_la_compatible_con_node: {
        return entry.path.startsWith(dir + "/") && (entry.path.replace(dir + "/", "").match(/\//g) === null);
      }
    }).map(entry => this.basenameOf(entry.path));
    Esto_es_para_imitar_a_nodejs_tambien: {
      if(selection.length === 0) {
        const out = await this.crud.get("files", dir);
        if(!out) throw new Error(`IdbFilesystem.prototype.readDirectory complains that directory is not found: ${dir}`);
      }
    }
    return selection;
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

}