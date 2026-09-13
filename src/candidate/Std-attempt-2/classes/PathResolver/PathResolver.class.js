class PathResolver {

  static {
    Object.assign(this, {
      create: Std.all.Creable.create,
      isDebugging: false,
    });
    Object.assign(this.prototype, {
      clone: Std.all.Clonable.clone,
      config: Std.all.Configurable.config,
    });
    Object.defineProperties(this, Object.getOwnPropertyDescriptors(Std.all.Newable));
  }

  isDebugging = this.constructor.isDebugging;

  basedir = "~";
  
  rootdir = "~";

  normalizationOf(input) {
    let output = input.replaceAll("\\", "/");
    if (/^[a-z]+:\/\//i.test(output)) output = output;
    if (output.startsWith("@/")) output = this.rootdir + output.slice(1);
    if (output.startsWith("./") || output.startsWith("../")) output = output.startsWith("./") ? this.basedir + output.slice(1) : require("path").resolve(this.basedir, output);
    if (/^[A-Z]:\//i.test(output)) output = "/" + output[0] + output.slice(2);
    if (output.startsWith("//")) output = output.slice(1);
    if (output.startsWith("/")) output = output;
    if(this.isDebugging) {
      console.log("[*] [DEBUG] PathResolver.prototype.normalizationOf:");
      console.log("[*]    [in] " + input);
      console.log("[*]   [out] " + output);
    }
    return output;
  }

  basepathOf(input) {
    return this._relativePath(input, this.basedir, ".");
  }

  rootpathOf(input) {
    return this._relativePath(input, this.rootdir, "@");
  }

  _relativePath(_path, _anchor, prefix) {
    let output = undefined;
    let path = this.normalizationOf(_path);
    let anchor = _anchor === "/" ? "/" : _anchor.replace(/\/$/, "");
    if (path === anchor) output = prefix + "/";
    if (anchor !== "/" && !path.startsWith(anchor + "/")) output = path;
    else output = prefix + (anchor === "/" ? path : path.slice(anchor.length));
    return output;
  }

  setBasedir(input) {
    this.basedir = this.normalizationOf(input);
  }

  setRootdir(input) {
    this.rootdir = this.normalizationOf(input);
  }

}