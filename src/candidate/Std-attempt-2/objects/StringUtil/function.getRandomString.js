function getRandomString(len, alphabet = this.defaultAlphabet) {
  let out = "";
  while(out.length < len) {
    out += alphabet[Math.floor(Math.random()*alphabet.length)];
  }
  return out;
}