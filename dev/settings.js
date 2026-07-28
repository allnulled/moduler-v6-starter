module.exports = async function() {
  return {
    instrumentalize: [
      "**/dist/www/app.dist.js"
    ],
    loop: {
      port: 3006,
      controllers: [],
    }
  }
};