const path = require('path')
module.exports = {
    entry: './ananas.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    output: {
        filename: 'ananas-bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
}
