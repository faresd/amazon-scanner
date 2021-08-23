const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: './app.js',
    optimization: {
        minimize: false
    },
    output: {
        libraryTarget: 'umd',
        path: path.resolve('./dist'),
        filename: 'app.js',
    },
    plugins: [
        new Dotenv({ignoreStub: true})
    ],
};
