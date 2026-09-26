class VirtualFilesystemDrivers {
  static Vfs = VirtualFilesystem;
  static assert = VirtualFilesystem.assert;
  static Abstraction = /*@injects:"./Abstraction/VfsDriverAbstraction.class.js"*/;
  /*@injects:"./static.load.js"*/
}