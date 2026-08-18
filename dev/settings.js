module.exports = async function() {
  return {
    env: "dev",
    test: {
      features: [
        "^003.",
      ],
      case: [],
      speed: [],
    },
    instrumentalize: [
      "@/dist/www/app.dist.js",
      "@/dist/www/std/application/Application/Application.dist.js",
      "@/dist/www/test.dist.js",
    ],
    loop: {
      port: 3007,
      controllers: [],
    }
  }
};