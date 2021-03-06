let path = require("path"),
    _ = require("lodash"),
    webpack = require("webpack"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

const vendor = [
    "lodash",
    "react",
    "react-dom",
    "react-router",
    "socket.io-client",
    "rxjs"
];

function createConfig(isDebug) {
    const devtool = isDebug ? "eval-source-map" : false;
    const plugins = [
        new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.js"}),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: `"${process.env.NODE_ENV || "development"}"`
            },
            IS_PRODUCTION: !isDebug,
            IS_DEVELOPMENT: isDebug
        })
    ];

    const loaders = {
        js: 	{test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/},
        eslint: {test: /\.jsx?$/, loader: "eslint-loader", exclude: /node_modules/},
        json: 	{test: /\.json$/, loader: "json-loader"},
        css: 	{test: /\.css$/, loader: "style-loader!css-loader?sourceMap"},
        sass: 	{test: /\.scss$/, loader: "style-loader!css-loader?sourceMap!sass-loader?sourceMap"},
        files:	{test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=500"}
    };

    const clientEntry = ["babel-polyfill", "./src/client/client.js"];
    let publicPath = "/build/";
    if (isDebug) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NamedModulesPlugin());
        clientEntry.unshift(
            "react-hot-loader/patch",
            "webpack-dev-server/client?http://localhost:8080/",
            "webpack/hot/only-dev-server"
        );
        publicPath = "http://localhost:8080/build/";

    } else {
        plugins.push(
            new ExtractTextPlugin("[name].css"),
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
        );
        loaders.css.loader = ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader"});
        loaders.sass.loader = ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader!sass-loader"});

    }   

    return {
        name: "client",
        devtool,
        entry: {
            app: clientEntry,
            vendor
        },
        output: {
            path: path.join(__dirname, "public", "build"),
            filename: "[name].js",
            publicPath
        },
        resolve: {
            extensions: ["*", ".js", ".jsx"],
            alias: {
                shared: path.join(__dirname, "src", "server", "shared")
            }
        },
        module: {
            rules: _.values(loaders)
        },
        plugins
    };
}

module.exports = createConfig(process.env.NODE_ENV !== "production");
// module.exports.create = createConfig();