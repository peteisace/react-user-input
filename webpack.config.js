var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var webpack = require('webpack');
var process = require('process');
const result = require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: ['./src/index.tsx'],
    output: {
        path: path.resolve(__dirname, 'wwwroot'),
        filename: isDev ? 'scripts/bundle.js' : 'scripts/bundle_[hash].js'
    },
    watch: true,
    resolve: {
        modules: [__dirname, 'src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx']        
    },
    devServer: {
        contentBase: './wwwroot',
        hot: isDev
    },
    module : {
        rules: [
            {
                test: /\.(j|t)sx$/, 
                use: [                         
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            plugins: ['react-hot-loader/babel']
                        }
                     }, 
                     'ts-loader'], 
                exclude: /node_modules/                
            },
            {
                test: /\.(s)?css$/,
                use: [                                        
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {                            
                            hmr: isDev
                        }                        
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                            publicPath: url => '../' + url
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'Base setup for react projects: Simplified.',
            inject: true         
        }),
        new MiniCssExtractPlugin({
            filename: './styles/[name].css'
        })
    ]  
}
