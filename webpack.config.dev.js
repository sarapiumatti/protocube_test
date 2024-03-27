const path = require("path");
const { merge } = require("webpack-merge");

// workaround to get the first port available
// https://github.com/webpack/webpack-cli/issues/2051
const portFinderSync = require('portfinder-sync')

const DefinePlugin = require("webpack").DefinePlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.config.common");

let settings = merge(common, {
  mode: "development",
  devtool: "source-map",
  entry: {
    maindev: {
      import: "./src/index.ts",
      dependOn: "shared",
    },
  },
  infrastructureLogging: {
    level: "verbose",
  },
  devServer: {
    static: {
			directory: path.join(__dirname, "static"),
		},
    port: portFinderSync.getPort(8080),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      title: "ThreeJS Home Development",
      template: "tpl/index-app.html",
      filename: `index.html`,
      chunks: ["maindev", "shared", "runtime"],
    }),
  ],
});

module.exports = settings;
