module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'force-strict-loader',
                options: {
                    sourceMap: true
                }
            }
        }],
    },
    devServer: {
        publicPath: "/dist"
    }
}