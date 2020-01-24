const withCSS = require("./utils/next-css");
module.exports = withCSS({
  webpack(config) {
    // Disabled to rule out other possibilities
    config.optimization.minimize = false;
    return config;
  }
});
