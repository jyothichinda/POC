const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dependencies = require("./package.json");

module.exports = {
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  entry: "./src/index.js",
  output: {
    publicPath: "auto",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      filename: "remoteEntry.js",
      remotes: {
        // auth: "auth@http://localhost:3001/remoteEntry.js",
        dashboard: "dashboard@http://localhost:3002/remoteEntry.js",
        transactions: "transactions@http://localhost:3003/remoteEntry.js",
        cashflowforecast:
          "cashflowforecast@http://localhost:3008/remoteEntry.js",
        cashReserves: "cashReserves@http://localhost:3006/remoteEntry.js",
        configurations: "configurations@http://localhost:3007/remoteEntry.js",
        pooling: "pooling@http://localhost:3004/remoteEntry.js",
        sweeping: "sweeping@http://localhost:3005/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
        swr: { singleton: true, requiredVersion: dependencies.swr },
        antd: { singleton: true, requiredVersion: dependencies.antd },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
