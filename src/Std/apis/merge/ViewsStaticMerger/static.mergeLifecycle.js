static mergeLifecycle(property, value, mergedView) {
  if (typeof value !== "function" && !Array.isArray(value)) return;
  if (!mergedView[property]) mergedView[property] = [];
  if (Array.isArray(value)) mergedView[property].push(...value);
  else mergedView[property].push(value);
}