throw new Error("Dont use this class");
class SwitchableFilesystem {
  constructor() {
    this._node = false;
    this._idb = false;
    this.mode = Std.classes.Environmenter.isBrowser ? "idb" : "node";
  }

  get fs() {
    return this[this.mode];
  }

  get node() {
    return this._node = this._node || new Std.classes.NodejsFilesystem();
  }

  get idb() {
    return this._idb = this._idb || new Std.classes.IdbFilesystem();
  }

  get mount() {
    return this[this.mode].mount;
  }

  get unmount() {
    return this[this.mode].unmount;
  }

  switchTo(mode) {
    $moduler.assert(["idb", "node"].includes(mode), `Parameter «mode» must be 'idb' or 'node'`);
    this.mode = mode;
    return this.mount();
  }

  get readFile() {
    return this[this.mode].readFile;
  }

  get writeFile() {
    return this[this.mode].writeFile;
  }

  get deleteFile() {
    return this[this.mode].deleteFile;
  }

  get hasFile() {
    return this[this.mode].hasFile;
  }

  get readDirectory() {
    return this[this.mode].readDirectory;
  }

  get writeDirectory() {
    return this[this.mode].writeDirectory;
  }

  get deleteDirectory() {
    return this[this.mode].deleteDirectory;
  }

  get hasDirectory() {
    return this[this.mode].hasDirectory;
  }

  get copyFile() {
    return this[this.mode].copyFile;
  }

  get copyDirectory() {
    return this[this.mode].copyDirectory;
  }

  get moveFile() {
    return this[this.mode].moveFile;
  }

  get moveDirectory() {
    return this[this.mode].moveDirectory;
  }

}