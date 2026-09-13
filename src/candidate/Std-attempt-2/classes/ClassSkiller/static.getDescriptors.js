static getDescriptors (target, filter = false) {
  if(!filter) return Object.getOwnPropertyDescriptors(target);
  return Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(target)).filter(filter));
}