class VfsDriverForLocalStorage extends VirtualFilesystem.Drivers.Abstraction {
  static async load() {
    console.log("Loading driver for localstorage");
  }
}