const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DefinePlugin = require("webpack").DefinePlugin;
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./webpack.config.common");

const settings = merge(common, {
  mode: "production",
  devtool: "source-map",
  performance: {
    hints: "warning",
  },
  module: {
    rules: [
      {
        exclude: /src\/Apps\/Samples/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js(\?.*)?$/i,
      }),
    ],
    runtimeChunk: "single",
  },
  entry: {
    maintech: {
      import: "./src/index.ts",
      dependOn: "shared",
    },
  },
  output: {
    filename: "[name].[contenthash].bundle.min.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      title: "ThreeJS Tech Demo",
      template: "tpl/index-app.html",
      filename: `index.html`,
      chunks: ["maintech", "shared", "runtime"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "static/assets/css", to: "assets/css" },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "static/assets",
          globOptions: {
            ignore: [],
          },
          to: "assets",
        },
      ],
    }),
  ],
});

module.exports = settings;
