const path = require("path");

module.exports = {
    entry: "./src/main.ts",
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, "public"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }
}