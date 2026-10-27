static getRandomLetters (len = 1, letters = this.letters) {
  let out = "";
  while(out.length < len) {
    out += letters[Math.floor(Math.random() * letters.length)];
  }
  return out;
}