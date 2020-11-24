/* 
    webpack配置文件，每次执行会自动读取里面的配置信息
    配置完webpack.config.jf后终端内下执行"webpack"即可自动打包

    PS:'./'代表当前目录的平级目录
*/


//出口文件路径推荐方法：智能拼装
const path = require('path');
// console.log(path.resolve(__dirname,'dist'))  //D:\VsCodeWorking\WebpackStudy\dist

//引入html插件
const hwp = require('html-webpack-plugin');

//引入css打包插件
const csspack = require('mini-css-extract-plugin');
const { loader } = require('mini-css-extract-plugin');  //当调用css插件的loader加载器时，自动生成通过解构赋值css插件属性loader的loader对象。

//引入css文件压缩插件
const cssoptimize =require('optimize-css-assets-webpack-plugin');

//引入clean清理打包文件插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports={                      //webpack的五个核心【entry\output\module\plugin\mode】
    //入口文件（单个入口）
    // entry:'./src/js/index.js',           //webpack会根据入口文件来打包入口文件的依赖和依赖的依赖

    //多个入口文件配置
    entry:{
        index:'./src/js/index.js',
        list:'./src/js/list.js'
    },


    //出口文件dangeruko
    output:{
        //文件名
        // filename:'js/bundles.js',                //“js/”写在文件名内，在打包后会自动生成js目录，如果将‘js/’写在path路径里面，则所用类型的加载都会在‘/dist/js’内
                                                //因为webpack本身只是对js文件的打包，其它类型的打包需要插件和加载器来完成，所以出口文件默认只设置了js文件
        //多个js出口文件：
        filename:'js/[name].js',

        //路径（绝对路径）
        path:path.resolve(__dirname,'./dist'),   //正式打包的bundle.js\html文件\css文件都会都会被打包在"dist"目录下面。
                                                 //path.resolve是nodeJs里面方法，可以连接两个相对路径并生成绝对路径
        // outputPath:'js'
        // publicPath:'/dist2/'  
        /* 
        ★output的publicPath和devserver的publiPath作用并不相同。
        在output的publicPath作用:
            publicPath被许多 webpack插件用于在生产模式下更新内嵌到 css、html 文件内的 url值
        output中的publicPath影响资源生成路径(比如插件url-loader，html-webpack-plugin生成的路径)，会给生成的静态资源路径添加前缀，一般用于生产环境，且一般为‘/’
        经实验，output的确实只是在url前面加上了'/dist2',且并不会生成‘dist2’文件目录，资源也并不存放在‘dist2’内,只是给所有引入的资源url前加入了配置的前缀目录。
        在生产环境时，有时候我们需要将我们的静态资源进行CDN托管这个时候我们只需要将config.build.publicPath换成CDN地址就好了。
        */
        // PS:  1.配置publicPath时最好写/publicPath/，不然html页面在访问生成静态资源路径时可能会出现找不到资源   
    },


    //模块解析
    resolve:{
        //导入路径省略后缀
        extensions:['.ts','.js','.json','.css','.less','.scss'],  //加入 ,'.jpg','jpeg' 后得以证明可以对html的图片可以后缀省略，但是js的css图片后缀不可以省略
        //导入路径的别名
        alias:{
            $css:path.resolve(__dirname,'./src/css')              //当路径太复杂时可以配置一个路径别名
        },
        //解析模块目录
        modules:['node_modules']                                  //其实应该写：'./node_modules'，它的机制是找不到以后会向上查询直到找到为止，
    },


    //配置webpack-dev-server    //【调试用的打包工具】 -- 动态刷新，实时调试。
    devServer:{              
        contentBase:path.resolve(__dirname,'devserver'),  //运行代码的目录
        //contentBase配置html页面的默认目录，不配置devserver默认为根目录，访问 http://localhost:3000/展现的是文件资源，因为根目录下我们并没有index.html文件
        //实验证明不配置的话 http://localhost:3000/就会打开根目录下的‘index.html’文件。且要注意contentBase的路径是相对webpack.config.js文件的。

        // publicPath:'/dist1/', 
        // 在devServer的publicPath作用:
        /* 虚拟打包的和加载的所用资源都放入的文件夹。
        ★devserver的publicpath并不会影响资源生成路径(比如插件url-loader，html-webpack-plugin生成的路径)。而是作为文件夹将内存打包的资源文件存放在此目录内，可访问不可见。
        项目中用到了html-webpack-plugin的时候，如果output也配置publicPath，那么插件、加载器的url前面的也会加上它的前缀。
        因为html-webpack-plugin在嵌入静态资源的时候使用的是output的publicPath，会导致在devServer运行的时候加载资源报错
        所以此时应该让devserver的publicPath和output的publicPath保持一致。 */

        //PS: devserver中outputPath:'/dist3',   //不可写，会报错

        /* 
            ####配置devserver-publicPath对正式打包和虚拟打包的影响####
            
            一、正式打包情况下：
            output正式打包，于devserver无关，无论是js文件还是加载器加载的各种其他类型文件，都会放在'output--'path'内。
            但devserver内存打包却要注意output的配置,尤其是'path'和'publicPath'

            二、devserver调试打包情况下：
                一.不需要对html文件打包时：
                    publicPath只需要与output-path(绝对路径)保持一致,那么内存中的html内的引用依然可以通过路径找到本地资源。
                    比如：正式打包的output-path为：“D:\VsCodeWorking\WebpackStudy\dist”，那么publicPath则设置为'/dist'

                二.需要对html文件打包时：
                    1.不配置devserver的publicPath的情况下:
                    资源文件（js、html、css、图片）：都方在默认的‘/’内,比如：http://localhost:3030/index.html、http://localhost:3030/js/bundle.js

                    2.配置了devserver的publicPath的情况下：
                    资源文件（js、html、css、图片）：所用内存打包的资源都会放入这个配置的文件目录下
            总结：  
                    1.output的publicPath是用来给生成的静态资源路径添加前缀的；
                    2.devServer中的publicPath是用来本地服务拦截带publicPath开头的请求的；
                    3.contentBase是用来指定被访问html页面所在目录的；
         */
        //端口号
        port:3000,
        //显示简略信息
        stats:'minimal',
        //自动打开浏览器
        open:true,
        //监视目录系所有文件，一旦文件变化就会reload
        watchContentBase:true,  
        watchOptions:{
            //忽略文件
            ignored:'/node_modules/'
        },
        //开启HMR热替换功能
        // hot:true,
        //设置代理
        proxy:{
            //匹配前缀‘/api’
            '/api':{
                //目标IP
                target:'https://cdn.ycku.com',
                //改变源
                changeOrigin:true,
                //重写url，去掉前缀‘/api’
                pathRewrite:{
                    '^/api':''
                }
            }
        }

    },
    

    //模块
    module:{                                                //模块相当于翻译官，webpack只能解析js\json，而module可以让webpack可以解析img、css等等                                    
        //规则
        rules:[
            //css、less以<style>形式插入html的加载器
            /* 
            //css文件
            {
                //test获取需要部署的文件后缀名
                test:/\.css$/i,                               //css文件加载器，让webpack可以打包css类型文件
                // use的执行顺寻时从右往左
                use:['style-loader','css-loader']             //当有多个加载器执行时，可以用数组形式

            },
            //less文件
            {
                test:/\.less$/i,                              
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader'                             //只比css加载多了一个步骤即less-loader加载器，将less转换成css形式
                ]
            },
            */


            //css、less、Scss以独立文件形式引入html的加载器
            //css文件
            {
                test:/\.css$/i,
                 use:[
                    {   //css打包文件插件本身也带有加载器功能
                        loader:csspack.loader,   
                        options:{                
                            //outputPath:'css111/',          正式和虚拟打包都不支持，I don't know why...
                            publicPath:'../'                //css内的图片url加上‘../’来返回上次菜单，css内的图片url需要相对css文件本身才可以被访问到。
                        }                                   //这边publicPath配置什么，取决于css文件和它引用的文件的关系
                    },                         
                    {
                        loader:'css-loader',
                        options:{
                            importLoaders:1                 //表示对import引入进来的css也可以被解析，这样ipmort进来的css也可以被转换兼容
                        }
                    },
                    'postcss-loader'                         //对css4语言以下采取兼容支持
                ]
            },

             //less文件
             {
                test:/\.less$/i,                             
                use:[
                    {
                        loader:csspack.loader,
                        options:{
                            publicPath:'../'               
                        }
                    },
                    'css-loader',
                    'less-loader'                            //只比css加载多了一个步骤即less-loader加载器，将less转换成css形式
                ]
            },

            //Scss文件
            {
                test:/\.scss$/i,                             
                use:[
                    {
                        loader:csspack.loader,
                        options:{
                            publicPath:'../'               
                        }
                    },
                    'css-loader',
                    'sass-loader'                            //只比css加载多了一个步骤即sass-loader加载器，将scss转换成css形式
                ]
            },


            //图片
            //Js/Css文件中的图片用file-loader或url-loader加载器
            //file-loader 加载JS/CSS图片
            /* {
                test:/\.(jpg|bmp|gif|jpeg|png)$/i,           //js/css文件中file-loader图片加载器
                loader:'file-loader',
                options:{
                    name:'src1/img/[name].[ext]',
                    esModule:false
                }
            },  */

            //url-loader 加载JS/CSS图片
            {
                test:/\.(jpg|bmp|gif|jpeg|png)$/i,           //js/css文件中url-loader图片加载器，url-load包含了file-loader加载器的功能。
                loader:'url-loader',                        //当只有一个加载器要执行时，可以用loader代替use，来写加载器的option
                options:{
                    limit:20480,                            //限定20kb以下次采用base64编码
                    name:'src1/img/[name].[ext]',                //设置打包后文件的路径地址
                    // 或者可以这样写：
                    // name:'[name].[ext]', 
                    // outputPath:'img',
                    esModule:false,                          //记得要将是否使用es语法，设置false，不然js内图片打包会出现 [object Module] 的情况

                    // publicPath:'../',
                }       
            },

            //html-loader加载html里的图片
            {
                test:/\.html$/i,                             //html文件中的图片加载器
                use:['html-loader']
            },


            //TS加载器
            {
                test:/\.ts$/,
                use:['ts-loader']                
            },


            //Es6语法解析成Es5语法
            {
                test:/\.js$/i,
                loader:'babel-loader',
                options:{
                    presets:[
                        '@babel/preset-env'                             //将Es6语法转换成Es5语法
                    ],
                    plugins:[ 
                        '@babel/plugin-proposal-class-properties'        //对新的还处于 提案中的语法进行转换成Es5
                    ]
                 }

            },

            //对js语句进行语法检查
            /* {
                 test:/\.js$/i,
                 loader:'eslint-loader',
                 //编译前执行
                 enforce:'pre',
                 //指定不检查的目录
                 exclude:/node_modules/
        
            } */
        ]
    },


    //插件【插件比模块功能更强大，可以让webpack实现支持各种类型文件的加载、优化压缩等功能】
    plugins:[

        //实例化一个打包HTML文件插件对象
        new hwp({
            template:'./src/index.html',         //不写，默认也是src下的index.html 【需要被打包的html文件】 
            filename:'index.html',
            chunks:['index']                     //通过chunks来分别为html页面加载不同的js文件
        }),
        //不同的html页面加载不同的js文件
        new hwp({
            template:'./src/list.html',         //不写，默认也是src下的index.html 【需要被打包的html文件】 
            filename:'list.html',
            chunks:['list']
        }),
        //同一个html文件模板加载不同的js来生成不同的html页面
        new hwp({
            template:'./src/index.html',
            filename:'index2.html',
            chunks:['list'],
            /* minify:{                        //在开发模式下也可以对html进行打包压缩
                collapseWhitespace:true,       //去掉空格
                removeComments:true            //去掉注释
            } */
        }),

        //实例化一个打包CSS文件插件的对象
        new csspack({
            filename:'css/[name].css',
        }),

        //实例化一个css文件打包压缩的文件
        // new cssoptimize()    //配置后内存打包中的css也会压缩，不需要压缩css文件的话注释掉即可,

        //clean清理
        new CleanWebpackPlugin({cleanStaleWebpackAssets:false}),  //要注意，在watch模式下，CleanWebpackPlugin 里的 cleanStaleWebpackAssets 要设置为 false 
                                                                     //防止监听到改变时把没有改变的文件给清除了,同时还可以继续每次打包时清理旧的打包文件
    ],


    //watch
    //文件监听
    // watch:true,
    watch:false,
    
    //开启文件监听后，可以设置更多
    watchOptions:{
        //不监听的模块目录
        ignored:/node_modules/,
        //防止更新频率过快，默认300毫秒
        aggregateTimeout:5000,
        //轮询间隔时间，询问系统指定文件是否发生了变化
        poll:1000
    },


    //devTool 映射源文件
    // devtool:'source-map',   //source-map配置可以将打包后的代码映射到源代码上，这样可以方便调试。并且会生成‘.map’文件。
    devtool:'eval-source-map',   //打包后每个模块都执行eval,eval内包含了每一个打包好的代码。
    /* 
        开发环境适合用 eval-source-map 因为它的同时在生成文件和源文件中报出错误信息
       生产环境适合用 source-map
     */ 

    //生成模式
    mode:'development',     //开发模式
    // mode:'production',      //生产模式
};
//webpack打包会有物理地址和逻辑地址
/* 物理地址即根据‘output的path路径’+‘插件、加载器配置的地址（filename、outputPath）’来决定的打包后的文件资源放在哪里
逻辑地址是html/js/css/img的url。 */

//关于打包后的url路径：
/* 
    实验中没给index.html加上级目录之前，我的理解是，webpack所有的url都是相对于index.html的，这样就导致css文件内的url也是相对index.html文件而生成的路径，
    可是css文件的url，应该相对css文件才能访问，因为浏览器对css的加载机制和js/html不同，js/html这两个是一起解析的所以js/html文件的url的确应该相对于html文件。
    但css文件是单独解析的，所以css内的url应当是相对于css文件本身的。
    所以当不给index.html添加上级目录时，需要修改css插件里的publicPath为'../',让css内的url添加前缀'../'返回了上级目录(和index.html保持同级)，就可以正常访问到url资源了。

    可怕的是！！！通过给打包后的index.html文件添加上级目录(filename:'html/index.html')来看，html对css和js的路径都会自动前缀加'../'来返回上一级目录。
    可唯独对图片资源不会，无论是html内、js内、css内都不会自动加'../'来保证url的正确性，当然给图片资源添加上级目录，index.html的url是会更新的。
*/