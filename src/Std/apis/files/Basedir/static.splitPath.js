function splitPath (subpath) {
  const out = [""];
  let index = 0;
  while (index < subpath.length) {
    const ch = subpath[index];
    if (ch === "/" || ch === "\\") {
      out.push("");
    } else {
      out[out.length - 1] += ch;
    }
    index++;
  }
  return out;
}