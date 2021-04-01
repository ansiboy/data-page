const webpack = require('webpack');
module.exports = {
    entry: __dirname + "/out/index.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist", //打包后的文件存放的地方
        filename: "index.min.js", //打包后输出文件的文件名
        libraryTarget: "umd",
        library: "chitu-admin"
    },
    // mode: 'development',
    mode: "production",
    devtool: 'source-map',
    externals: [
        'react', 'react-dom', 'less', 'lessjs',
        'maishu-chitu', 'maishu-chitu-react', 'maishu-dilu', 'maishu-dilu-react',
        'maishu-toolkit', 'maishu-ui-toolkit',
        'maishu-wuzhui', 'maishu-wuzhui-helper',
    ],
    module: {
        rules: [{
            test: /\.less$/i,
            use: 'raw-loader',
        }]
    }
}