function renderSimpleTemplate(text, data = {}) {
  return text.replace(/\$\{([^}]+)\}/g, (_, key) => data[key.trim()]);
}