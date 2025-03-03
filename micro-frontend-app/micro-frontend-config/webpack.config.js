const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 3007,
  },
  entry: "./src/index.js",
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], 
  },
  
  plugins: [
    new ModuleFederationPlugin({
      name: "configurations",
      filename: "remoteEntry.js",
      exposes: {
        "./ConfigurationsPage": "./src/bootstrap",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        swr: { singleton: true, requiredVersion: "^2.3.2" },
        antd: { singleton: true, requiredVersion: "^5.24.1" },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options:{
            presets: ["@babel/preset-react","@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
