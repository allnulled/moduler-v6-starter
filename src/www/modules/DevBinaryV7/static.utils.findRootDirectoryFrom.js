async (file, target = "package.json") => {
  const fsp = require("fs").promises;
  const path = require("path");
  let dir = file;
  let dirBefore = null;
  let isSatisfied = false;
  do {
    dirBefore = dir;
    dir = path.dirname(dir);
    const fileTarget = `${dir}/${target}`;
    isSatisfied = await fsp.access(fileTarget).then(() => true).catch(() => false);
    if(isSatisfied) return dir;
  } while(dir !== dirBefore);
  return null;
}