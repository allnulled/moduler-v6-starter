function resolvePath (subpathsInput, origin = false) {
  $moduler.assert(Array.isArray(subpathsInput), `Parameter «subpaths» must be array on «ModulerV6.prototype._joinPaths»`);
  $moduler.assert(subpathsInput.length !== 0, `Parameter «subpaths.length» cannot be 0 on «ModulerV6.prototype._joinPaths»`);
  let out = "", activatedOptions = {};
  const subpaths = [].concat(subpathsInput);
  Correct_filesymbols: {
    $moduler.assert(typeof subpaths[0] === "string", `Parameter «subpaths[0]» must be string but «${typeof subpaths[0]}» was found instead on «ModulerV6.prototype._joinPaths»`);
    const [_subpath, _activatedOptions] = this.constructor.removePathSymbols(subpaths[0], true);
    subpaths[0] = _subpath;
    activatedOptions = _activatedOptions;
  }
  Join_paths_overwritting_when_required:
  for(let index=0; index<subpaths.length; index++) {
    const subpath = subpaths[index];
    $moduler.assert(typeof subpath === "string", `Parameter «subpaths[${index}]» must be string too on «ModulerV6.prototype._joinPaths»`);
    $moduler.assert(subpath !== "", `Parameter «subpaths[${index}]» cannot be empty string on «ModulerV6.prototype._joinPaths»`);
    if(subpath.includes("://")) {
      // @case Ruta por protocolo
      $moduler.assert(subpath.match(this.constructor.pathSymbols.REGEX_FOR_PROTOCOL_BASED_PATH), `Paths can only have «://» at the begining, and preceded only by a protocol id, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
      out = subpath;
    } else if(subpath.includes(":\\") || subpath.includes(":/") || subpath.startsWith("\\\\") || subpath.startsWith("//")) {
      // @case Ruta absoluta estilo Windows
      $moduler.assert(subpath.match(this.constructor.pathSymbols.REGEX_FOR_ABSOLUTE_WINDOWS_PATH), `Paths can only have «:\\|:/|\\\\|//» at the begining, and preceded only by a standard Windows disk unit identifier, if any in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
      out = subpath;
    } else if(subpath.startsWith("/")) {
      // @case Ruta absoluta estilo Linux
      out = subpath;
    } else if(subpath.startsWith("./")) {
      // @case Ruta relativa al basedir
      $moduler.assert(typeof this.basedir === "string", `Cannot use «./» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
      out = this.constructor.appendPathSeparator(this.basedir) + subpath.substr(2);
    } else if(subpath.startsWith("../")) {
      // @case Ruta relativa al basedir pero directorio superior
      $moduler.assert(typeof this.basedir === "string", `Cannot use «../» expression because «this.basedir» is «${typeof this.basedir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
      out = this.constructor.appendPathSeparator(this.basedir, "..") + subpath.substr(3);
    } else if(subpath.startsWith("@/")) {
      // @case Ruta relativa al rootdir
      $moduler.assert(typeof this.rootdir === "string", `Cannot use «@/» expression because «this.rootdir» is «${typeof this.rootdir}» right now in the case of «${subpath}» on «ModulerV6.prototype._joinPaths»`);
      out = this.constructor.appendPathSeparator(this.rootdir) + subpath.substr(2);
    } else {
      // @case Cualquier otra ruta
      if(out.length) {
        out = this.constructor.appendPathSeparator(out) + subpath;
      } else {
        out = subpath;
      }
    }
  }
  Resolve_one_and_two_dots: {
    //    C:/una/ruta/absoluta.js
    //    C:\una\ruta\absoluta.js
    //    \\una\ruta\absoluta.js
    //    /una/ruta/absoluta.js
    //    ://una/ruta/absoluta.js
    //    http://una/ruta/absoluta.js
    //    ./una/ruta/relativa.js
    //    ../una/ruta/relativa.js
    //    @/una/ruta/relativa.js
    //    una/ruta/relativa.js
    const parts = this.constructor.splitPath(out);
    const newParts = []
    for(let index=0; index<parts.length; index++) {
      const part = parts[index];
      if(part === "..") {
        newParts.pop();
      } else if(part === ".") {
        // @OK.
      } else {
        newParts.push(part);
      }
    }
    out = newParts.join("/");
  }
  if(activatedOptions.justTry) {
    out = `!${out}`;
  }
  return out;
}