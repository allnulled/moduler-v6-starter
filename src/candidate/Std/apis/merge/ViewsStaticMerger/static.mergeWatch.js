static mergeWatch(value, mergedView) {
  if (!value || typeof value !== "object") return;
  if (!mergedView.watch) mergedView.watch = {};
  for (const key of Object.keys(value)) {
    const current = mergedView.watch[key];
    const incoming = value[key];
    if (current === undefined) {
      mergedView.watch[key] = incoming;
    } else {
      let handlers = [];
      if (Array.isArray(current)) handlers.push(...current);
      else handlers.push(current);
      if (Array.isArray(incoming)) handlers.push(...incoming);
      else handlers.push(incoming);
      mergedView.watch[key] = handlers;
    }
  }
}