static load(driverId) {
  this.assert(driverId in this, `«$std.filesystem.VirtualFilesystem.Drivers.load» cannot load driver «${driverId}» because it has not a defined class`);
  const DriverClass = this[driverId];
  this.assert(DriverClass.prototype instanceof this.Abstraction, `«$std.filesystem.VirtualFilesystem.Drivers.load» cannot accept driver «${driverId}» because it is not a «Vfs.Drivers.Abstraction» class extension`);
  return DriverClass.load();
}