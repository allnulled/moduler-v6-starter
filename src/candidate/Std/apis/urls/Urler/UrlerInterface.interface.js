{
  static: {},
  prototype: {
    isDebugging: this.constructor.isDebugging,
    basedir: "~",
    rootdir: "~",
    normalizationOf(input) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.UrlerInterface.prototype.normalizationOf"});
      let output = input.replaceAll("\\", "/");
      if (/^[a-z]+:\/\//i.test(output)) output = output;
      if (output.startsWith("@/")) output = this.rootdir + output.slice(1);
      if (output.startsWith("./") || output.startsWith("../")) output = output.startsWith("./") ? this.basedir + output.slice(1) : require("path").resolve(this.basedir, output);
      if (/^[A-Z]:\//i.test(output)) output = "/" + output[0] + output.slice(2);
      if (output.startsWith("//")) output = output.slice(1);
      if (output.startsWith("/")) output = output;
      if (this.isDebugging) {
        console.log("[*] [DEBUG] PathResolver.prototype.normalizationOf:");
        console.log("[*]    [in] " + input);
        console.log("[*]   [out] " + output);
      }
      return output;
    },
    basepathOf(input) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.UrlerInterface.prototype.basepathOf"});
      return this._relativePath(input, this.basedir, ".");
    },
    rootpathOf(input) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.UrlerInterface.prototype.rootpathOf"});
      return this._relativePath(input, this.rootdir, "@");
    },
    _relativePath(_path, _anchor, prefix) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.UrlerInterface.prototype._relativePath"});
      let output = undefined;
      let path = this.normalizationOf(_path);
      let anchor = _anchor === "/" ? "/" : _anchor.replace(/\/$/, "");
      if (path === anchor) output = prefix + "/";
      if (anchor !== "/" && !path.startsWith(anchor + "/")) output = path;
      else output = prefix + (anchor === "/" ? path : path.slice(anchor.length));
      return output;
    },
    setBasedir(input) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.UrlerInterface.prototype.setBasedir"});
      this.basedir = this.normalizationOf(input);
    },
    setRootdir(input) {
      $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.UrlerInterface.prototype.setRootdir"});
      this.rootdir = this.normalizationOf(input);
    },
  }
}