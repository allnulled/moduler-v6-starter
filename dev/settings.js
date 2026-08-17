module.exports = async function() {
  return {
    env: "dev",
    features: [
      "^003.",
    ],
    instrumentalize: [
      "@/dist/www/app.dist.js",
      "@/dist/www/std/application/Application/Application.dist.js",
      "@/dist/www/test.dist.js",
    ],
    loop: {
      port: 3009,
    }
  }
};