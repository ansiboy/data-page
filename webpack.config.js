const webpack = require('webpack');
let pkg = require("./package.json");
let license = `${pkg.name} v${pkg.version}`;
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
        'maishu-admin-scaffold',
        'maishu-chitu', 'maishu-chitu-react', 
        'maishu-data-page',
        'maishu-dilu', 'maishu-dilu-react',
        'maishu-node-mvc',
        'maishu-toolkit', 'maishu-ui-toolkit',
        'maishu-wuzhui', 'maishu-wuzhui-helper',
    ],
    module: {
        rules: [{
            test: /\.less$/i,
            use: 'raw-loader',
        }]
    },
    plugins: [
        new webpack.BannerPlugin(license),
    ],
}