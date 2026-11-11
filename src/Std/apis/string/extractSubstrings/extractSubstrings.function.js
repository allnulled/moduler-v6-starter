function extractSubstrings(text, initMatch, endMatch) {
  $moduler.assert(typeof text === "string", `Required parameter «text» to be string but «${typeof text}» was found instead on «Std.functions.extractSubstrings»`);
  $moduler.assert(typeof initMatch === "string", `Required parameter «initMatch» to be string but «${typeof initMatch}» was found instead on «Std.functions.extractSubstrings»`);
  $moduler.assert(typeof endMatch === "string", `Required parameter «endMatch» to be string but «${typeof endMatch}» was found instead on «Std.functions.extractSubstrings»`);
  const matches = [];
  let start = 0;
  while (true) {
    const initIndex = text.indexOf(initMatch, start);
    if (initIndex === -1) break;
    const contentStart = initIndex + initMatch.length;
    const endIndex = text.indexOf(endMatch, contentStart);
    if (endIndex === -1) break;
    matches.push(text.slice(contentStart, endIndex));
    start = endIndex + endMatch.length;
  }
  return matches;
}