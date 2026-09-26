function superiorPathOf (subpath) {
  const parts = this.splitPath(subpath);
  if(parts.pop() === "") parts.pop();
  return parts.join("/");
}