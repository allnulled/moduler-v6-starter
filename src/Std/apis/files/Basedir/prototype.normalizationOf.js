function normalizationOf (subpath) {
  $moduler.assert(typeof subpath === "string", `Parameter «subpath» must be string on «ModulerV6.prototype.normalizationOf»`);
  return this.resolvePath((subpath.startsWith("./") && this.basedir) ? [this.basedir, subpath] : [subpath], "normalizationOf");
}