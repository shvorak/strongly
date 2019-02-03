module.exports = {
    entry: __dirname + "/source/index.ts",

    output: {
        path: __dirname + "/lib",

        filename: "strongly.js",
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
    ],

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    optimization : {
        minimize : true,

    }

};