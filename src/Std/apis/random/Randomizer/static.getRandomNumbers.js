static getRandomNumbers (len = 1, numbersList = this.numbers) {
  let out = "";
  while(out.length < len) {
    out += numbersList[Math.floor(Math.random() * numbersList.length)];
  }
  return out;
}