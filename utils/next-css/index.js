const cssLoaderConfig = require("./css-loader-config");
const path = require("path");

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
        );
      }

      const { dev, isServer } = options;
      const { cssLoaderOptions, postcssLoaderOptions } = nextConfig;

      const modulesConfig = cssLoaderConfig(config, {
        extensions: ["css"],
        cssLoaderOptions: Object.assign({}, cssLoaderOptions, {
          importLoaders: 1,
          modules: {
            mode: "local",
            localIdentName: "[name]_[local]__[hash:base64:5]",
            context: path.resolve(__dirname, ".")
          }
        }),
        postcssLoaderOptions,
        dev,
        isServer
      });

      const globalConfig = cssLoaderConfig(config, {
        extensions: ["css"],
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer
      });

      const cssModules = {
        test: /\.css$/,
        exclude: /global.css$/,
        issuer(issuer) {
          if (issuer.match(/pages[\\/]_document\.js$/)) {
            throw new Error(
              "You can not import CSS files in pages/_document.js, use pages/_app.js instead."
            );
          }
          return true;
        },
        use: modulesConfig
      };

      const globalCss = {
        test: /global.css$/,
        issuer(issuer) {
          // console.log(issuer)
          if (issuer.match(/pages[\\/]_document\.js$/)) {
            throw new Error(
              "You can not import CSS files in pages/_document.js, use pages/_app.js instead."
            );
          }
          return true;
        },
        use: globalConfig
      };

      config.module.rules.push(cssModules);
      config.module.rules.push(globalCss);

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
