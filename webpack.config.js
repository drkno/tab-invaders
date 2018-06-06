const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SuppressChunksPlugin = (require('suppress-chunks-webpack-plugin')).default;
const { getEntryPoints } = require('./scripts/manifest-manipulator.js');
const manifest = require('./src/manifest.json');

const entryPoints = getEntryPoints(manifest);

module.exports = {
    resolveLoader: {
        modules: [path.join(__dirname, 'scripts'), 'node_modules']
    },
    entry: entryPoints,
    output: {
        path: path.join(__dirname, 'build', 'extension'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /manifest\.json$/,
                loader: 'manifest-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|css)$/,
                loader: 'file-loader',
                exclude: [/node_modules/, /src\/img\/screenshots/]
            },
            {
                test: /\.html$/,
                loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader?attrs=img:src link:href',
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
        new CleanWebpackPlugin(['build']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new SuppressChunksPlugin(['manifest'])
    ],
    stats: {
        colors: true
    },
    devtool: process.env.WEBPACK_MODE === 'production' ? false : 'source-map',
    target: 'web'
};
