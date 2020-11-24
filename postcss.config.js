/*
    postcss 配置文件
 */
//postcss-preset-env 插件可以让转换css4以下的代码，让css代码兼容更多浏览器
 const PostPresetEnv  = require('postcss-preset-env');
 
 module.exports={
     plugins:[
         new PostPresetEnv({
            browsers:[
                '> 0.15% in CN',   // 让css代码转换成在中国大于0.15%使用率的浏览器
            ]
         })
    ]
 }

/* 
 步骤：
    1.首先安装两个插件，postcss-loader\postcss-preset-env，两个要搭配着使用。
    2.并配置一个'postcss.config.js'的文件，写一些具体的要求
    3.在'webpack.config.jg'文件的css加载器模块中的'css-loader'下面，添加'postcss-loader'加载器，对css4语言以下采取兼容支持
    4.有些css文件是import进来的也需要css兼容转换，所以需要在'css-loader'里面设置options:{importLoaders:1}
*/