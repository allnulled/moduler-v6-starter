static getRandomConsonant (len = 1, consonants = this.consonants) {
  let out = "";
  while(out.length < len) {
    out += this.getRandomItemFrom(consonants);
  }
  return out;
}