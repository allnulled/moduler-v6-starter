static getRandomSentence (wordsBrute = 0) {
  const words = wordsBrute > 0 ? wordsBrute : parseInt(this.getRandomItemFrom("2233333344444444555555555556666666666666777788".split("")));
  const items = [];
  while(items.length < words) {
    items.push(this.getRandomWord(0));
  }
  const out = items.join(" ");
  return out.substr(0,1).toUpperCase() + out.substr(1) + ".";
}