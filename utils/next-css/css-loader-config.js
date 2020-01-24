/* eslint-disable complexity */
const MiniCssExtractPlugin = require("extract-css-chunks-webpack-plugin");

const fileExtensions = new Set();

module.exports = (
  config,
  {
    extensions = [],
    cssLoaderOptions = {},
    dev,
    isServer,
    postcssLoaderOptions = {},
    loaders = []
  }
) => {
  // We have to keep a list of extensions for the splitchunk config
  for (const extension of extensions) {
    fileExtensions.add(extension);
  }

  if (!isServer) {
    config.optimization.splitChunks.cacheGroups.styles = {
      name: "styles",
      test: new RegExp(`\\.+(${[...fileExtensions].join("|")})$`),
      chunks: "all",
      maxInitialRequests: 3,
      enforce: true
    };
  }

  if (!isServer) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: dev
          ? "static/css/[name].css"
          : "static/css/[contenthash:8].css",
        chunkFilename: dev
          ? "static/css/[name].chunk.css"
          : "static/css/[contenthash:8].chunk.css",
        ignoreOrder: true,
        hot: dev
      })
    );
  }

  const cssLoader = {
    loader: "css-loader",
    options: Object.assign(
      {},
      {
        url: true,
        import: true,
        onlyLocals: isServer,
        sourceMap: dev,
        importLoaders: loaders.length
      },
      cssLoaderOptions
    )
  };
  // When not using css modules we don't transpile on the server
  if (isServer && !cssLoader.options.modules) {
    return ["ignore-loader"];
  }

  // When on the server and using css modules we transpile the css
  if (isServer && cssLoader.options.modules && !dev) {
    return [cssLoader, ...loaders].filter(Boolean);
  }

  return [
    !isServer && dev && "extracted-loader",
    !isServer && MiniCssExtractPlugin.loader,
    cssLoader,
    ...loaders
  ].filter(Boolean);
};
