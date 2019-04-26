const { join } = require('path');
const { DefinePlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SuppressChunksPlugin = (require('suppress-chunks-webpack-plugin')).default;

const getEntryPoints = require('./scripts/entry-point-locator');

module.exports = {
    resolveLoader: {
        modules: [join(__dirname, 'scripts'), 'node_modules']
    },
    entry: getEntryPoints('./src/'),
    output: {
        path: join(__dirname, 'build', 'extension'),
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
                exclude: [/src\/img\/screenshots/]
            },
            {
                test: /\.html$/,
                loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader?attrs=img:src link:href!html-entry-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                'targets': {
                                    'firefox': '60',
                                    'chrome': '58'
                                }
                            }
                        ]
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        ['@babel/plugin-transform-react-jsx', {
                            'pragma': 'preact.h'
                        }]
                    ]
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new DefinePlugin({
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
