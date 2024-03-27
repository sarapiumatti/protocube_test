const path = require("path");

module.exports = {
  mode: "development",
  resolve: {
    extensions: [".ts", ".js", ".glsl"],
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  resolveLoader: {
    alias: {
      "poly-glsl-loader": path.join(
        __dirname,
        "packages/glsl-loader/poly-glsl-loader"
      ),
    },
  },
  entry: {
    shared: ["three"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.glsl$/,
        loader: "poly-glsl-loader",
        exclude: /node_modules/,
      },
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
