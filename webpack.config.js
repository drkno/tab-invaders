const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['webextension-polyfill', './src/scripts/main.js'],
    output: {
        path: path.join(__dirname, 'build', 'extension'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
