// __dirname是nodejs中的一个全局变量，它指向当前执行脚本所在的目录
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: __dirname + "/app/main.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle-[hash].js"
    },

    devtool: "eval-source-map",

    devServer: {
        contentBase: "./public",
        port: 9009,                     // 默认为8080
        historyApiFallback: true,
        inline: true
    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true,      // 指定启用css modules
                            localIdentName: '[name]_[local]--[hash:base64:5]'       // 指定css的类名样式
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.BannerPlugin('版权所有'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.html.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('style.css'),
        new CleanWebpackPlugin('build/*', {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ]
}