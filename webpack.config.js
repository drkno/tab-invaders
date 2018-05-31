const path = require('path');
const webpack = require('webpack');

module.exports = {
    resolveLoader: {
        modules: [path.join(__dirname, 'scripts'), 'node_modules']
    },
    entry: ['webextension-polyfill', './src/scripts/main.js'],
    output: {
        path: path.join(__dirname, 'build', 'extension'),
        filename: '[name].[ext]'
    },
    module: {
        rules: [
            {
                test: /manifest\.json$/,
                loader: 'manifest-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'file-loader',
                exclude: [/node_modules/, /src\/img\/screenshots/]
            },
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
