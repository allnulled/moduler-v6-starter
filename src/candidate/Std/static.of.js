function (selector) {
  const parts = selector.split(this.splitter);
  const acc = [];
  let pivot = this;
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    acc.push(part);
    if (!["object", "function"].includes(typeof pivot)) throw new Error(`Cannot access property «Std${acc.map(it => "." + it).join("")}» because «Std${acc.slice(0, -1).map(it => "." + it).join("")}» should be function or object but «${typeof pivot}» was found instead on «Std»`);
    if (!(part in pivot)) throw new Error(`Cannot access property «Std${acc.map(it => "." + it).join("")}» because «Std${acc.slice(0, -1).map(it => "." + it).join("")}» does not contain any property «${part}» on «Std»`);
    pivot = pivot[part];
  }
  return pivot;
}