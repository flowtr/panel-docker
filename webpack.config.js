var WebpackProgressOraPlugin = require("webpack-progress-ora-plugin");
const path = require("upath");

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./app/index.tsx",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "public", "js"),
    },

    devtool: "source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },

    plugins: [new WebpackProgressOraPlugin()],

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.s?css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};
