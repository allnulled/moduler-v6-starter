static getRandomClassName (len = 20) {
  let out = this.getRandomLetters(len);
  return out.substr(0,1).toUpperCase() + out.substr(1);
}