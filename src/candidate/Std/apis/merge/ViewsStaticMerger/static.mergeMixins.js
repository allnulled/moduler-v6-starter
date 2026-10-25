static mergeMixins(value, mergedView) {
  if (!Array.isArray(value)) return;
  if (!mergedView.mixins) mergedView.mixins = [];
  mergedView.mixins.push(...value);
}