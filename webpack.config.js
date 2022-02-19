var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/index.ts');
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html');
var SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: ENTRY_PATH,
    plugins: [
        new HtmlWebpackPlugin({
            title: 'WebGL Project Boilerplate',
            template: TEMPLATE_PATH,
            inject: 'body'
        })
    ],
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.glsl$/,
                include: SHADER_PATH,
                loader: 'webpack-glsl'
            }
        ]
    },
    mode: 'none',
    devtool: 'inline-source-map'
};