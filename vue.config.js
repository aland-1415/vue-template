module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // outputDir:'D:/documents/gitReporsity/qa-rtp/src/main/resources/static',
    devServer: {
        port: 8080,
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    }
}