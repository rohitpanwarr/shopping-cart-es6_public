const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
    entry: [
        path.resolve(__dirname, 'src/js'),
        path.resolve(__dirname, 'src/scss/main.scss')
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
             {
                 test: /\.js$/,
                 exclude: /node_modules/,
                 use: {
                     loader: 'babel-loader',
                     options: {
                         presets: ['@babel/preset-env']
                     }
                 }
             },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname, 'public/assets')
            },
            {
                from: path.resolve(__dirname, 'data'),
                to: path.resolve(__dirname, 'public/data')
            }
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new HtmlWebpackPlugin({
			template: './index.html',
			filename: './index.html'
		})
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        compress: true,
        port: 9000
    }
};

module.exports = webpackConfig;