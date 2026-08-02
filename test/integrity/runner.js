const fs = require("fs");
const path = require("path");
const devBinaryV6 = require(`${__dirname}/../../dev/bin.js`);

const caseFiles = fs.readdirSync(`${__dirname}/case`).filter(f => f.endsWith(".js"));

const main = async function () {
  const context = { devBinaryV6, };
  for (let index = 0; index < caseFiles.length; index++) {
    const filename = caseFiles[index];
    const filepath = `${__dirname}/case/${filename}`;
    const testCallback = require(filepath);
    console.log(`[*] Integrity test nº ${index}: «${filename}»`);
    if (typeof testCallback !== "function") {
      throw new Error(`Integrity test file with name «${filename}» must export a function`);
    }
    try {
      const result = await testCallback(context);
      console.log(`[*] Integrity test ok.`);
    } catch (error) {
      console.log(`[!] Integrity test failed:`, error);
      console.log(error);
    }
  }
  console.log(`[*] Integrity tests finished`);
};

module.exports = main();