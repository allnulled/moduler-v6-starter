static getRandomVocal (len = 1, vocals = this.vocals) {
  let out = "";
  let previous = null;
  while(out.length < len) {
    out += previous = this.getRandomItemFrom(vocals.filter(v => v !== previous));
  }
  return out;
}