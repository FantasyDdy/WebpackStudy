//入口文件
//webpack只要对入口文件进行打包，它所依赖的包（以及包所依赖的包）都会被自动打包。

//引入模块
let md1 = require('./module1');
console.log(md1.name);

//webpack【对js/json模块打包】
/* 
需要通过webpack对模块化的js文件进行打包编译node代码，让浏览器可识别

打包命令：
        webpack src/index.js -o dist/bundle.js --mode=development
但是语句过于繁琐，处理方式有两种：
方法一：
   配置package.json里的script属性，添加属性:build，"build":"npx webpack src/index.js -o dist/bundle.js --mode=development"
   控制台中只要执行：  npm run build

方法二：（★）
   方法一只适合简单的项目打包，webpack还提供了一个package.config.json配置文件
   控制台只要输入：    webpack
 */


 //webpack插件
 //Webpack-dev-Server【调试打包工具】
 /*  
    devserver适用于调试阶段，不用频繁的打包和调试
    它会自动打包到内存让开发者实时预览和调试
    到调试完成后再使用上面的方法进行最后真正的打包
 */

 //html-webpack-plugin【html打包插件】
 /* 
    html文件进行打包，可以通过webpack提供的html插件
    打包后的html会自动绑定webpack配置文件内出口文件的JS文件地址,所以打包前html不需要手写引入打包后的js路径。

    PS:默认打包的html文件是src文件下的index.html

   为什么要对html文件打包？
      因为如果只对js文件或者json文件打包，那么打包上线后，html文件需要把各种js、甚至css(对css文件也打包后)的引用地址都改为打包
   后的静态资源引用地址，如果将html也作为需要被打包的文件，就不用在html内写静态的js甚至是css文件的文件地址，webpack通过配置就可
   以在打包后自动给html添加对应的文件引用地址，这样就不用在上线后手动替换html内的静态资源引用地址了.
 */
 
//mini-css-extract-plugin【css打包插件】【单独的css文件形式】

//webpack-module
//moudle是帮助webpack可以加载各种类型文件的加载器的集合
//webpack只对js和json进行解析，而对css文件打包可以通过webpack五个核心之一的“module”，moudle相当于翻译官




//对css文件进行打包【以<style>的形式】
//'style-loader','css-loader','less-loader'【css文件打包】 loader意为"加载器"【需下载,loader属于module不同于plugin】

//引入css文件
require('$css/base');  //$css是路径别名，一个绝对路径

//引入less文件
require('../css/test');

/*  
   需要安装'style-loader','css-loader','less-loader'三个依赖
   'less-loader'把预处理的css文件，解析成css文件
   'css-loader'把css文件解析成字符串
   'style-loader'将解析好的字符串插入js文件内，再通过浏览器动态到页面标签

   webpack就会识别并打包css文件，并将css文件动态插入网页的<style>标签内
*/



//对图片进行打包
//'file-loader','url-loader','html-loader'【图片文件打包】
//webpack需要通过在module功能内引入'url-loader','html-loader'来完成webpack对图片的打包,否则遇到图片资源会报错
/* 
   'file-loader'解析js和css文件内的图片
   'url-loader'依赖与'file-loader'并且可以将图片转换为base64编码字符串
   'html-loader'解析html内插入的图片
*/

//JS加载图片(调试打包不会报错，因为依然可以访问到，但是正式打包后没有对img文件进行打包所以会访问不到)
window.onload=function(){
   // var img = document.createElement('img');
   // img.setAttribute('src','../img/jaychou.jpeg');
   // document.getElementsByClassName('jaychou')[0].appendChild(img);
   //上述这种js写法无法被打包的
   
   //正确写法应该是通过模块化的方式引用图片路径，这样引用的图片就可以成功打包进 bundle 文件夹里了
   var img1 = require('../img/jaychou.jpeg');
   var imgHtml = '<img src="'+img1+'" alt="'+'周杰伦"'+'/>';
   document.getElementsByClassName('jaychou')[0].innerHTML = imgHtml;
   
   //注意js里的图片打包，file-loader\url-loader 需要在options内设置 esModule: false,
   //否则会出现“<img src="[object Module]" alt="周杰伦">”的情况
   //查看了下官网'esModule'表示使用ES模块语法，默认为true
}


//css文件加载图片
/* css文件加载图片，调试打包时就会被发现出错，js加载的图片在调试打包阶段蒙混过关
   JS和css都可以使用“file-loader”和“url-loader” 其实使用“url-loader”就够了
   “url-loader”依赖于“file-loader”的功能，所以也拥有“file-loader”的功能。
*/

//HTML加载图片
/*
    html-loader 
 */

//css、less以独立文件形式引入html的加载器
/*
   需要使用插件mini-css-extract-plugin，并在css-loader后使用mini-css-extract-plugin.loader，
 */

//postcss-loader\postcss-preset-env 对css文件进行兼容解析
/* 

 */


//打包Scss，它是Sass的升级
 /* 
    步骤：
      1.安装Scss的支持插件 cnpm i sass sass-loader node-sass -D (npm安装会失败)
      2.新建一个scss类型文件，并通过js页面引入scss类型文件
      3.在webpack.config.js中配置 scss类型文件的加载器

 */
require('../css/strong'); 


//npm i babel-loader @babel/core @babel/preset-env 将Es6语法转换成ES5
 /*
   babel-loader：于webpack协同工作的模块，在modules中的一个加载器作用。
   @babel/core： Babel编译器的核心，是babel-loader的核心模块
   @babel/preset-env：Babel预置器，用于分析Es6语法
   步骤：
      1.在webpack.config.js中添加关于js文件的babel-loader即可。
 */

 //ES6函数
 let n= (x,y)=> x+y;
 console.log(n(1,2));

 //ES6提案中的方法也可以通过babel来转换成Es5，但需要安装第四个插件：@babel/plugin-proposal-class-properties
 class Person{
    #name;      //提案中，类的私有属性
    constructor(){
      this.#name = 'ddy';
    }
 }

 //打包Ts
 /*
   步骤：
      1.安装让webpack支持对ts打包的插件 npm i typescript ts-loader -D
      2.在webpack.config.js中配置ts的加载器
      3.配置tsconfig.json文件
      4.需要在webpack.config.js 添加 resolve:{...},不然就要在引入的地方加后缀'.ts'
  */
 //import ts
 import {addts} from '../js/ts1'
 
 console.log(addts(3,3));

 //ESLint校验工具
 /*
   ESLint可以用于检查代码的语法问题和书写规范，书写规范可以使用‘eslint-config-airbnb’等插件来在打包时检查我们的书写规范，并可以自动修改
   这边我们先学对语法问题的检查
   步骤： 
      1.安装 eslint、eslint-loader两个插件
      2.安装配置信息，通过npx eslint --init命令来生成eslint.json配置文件，
      3.在webpack.config.js中配置eslint-loader
  */
 //测试eslint是否起作用
   // let a  = abc;


//多页面配置打包
/* 
   1.入口文件以键值对的方式，添加多个js入口文件
   entry:{                    
        index:'./src/js/index.js',
        list:'./src/js/list.js'
    }

    2.因为js文件有多少个，出口文件output中设置为
    filename:'js/[name].js'

    3.每一个html页面都需要实例化一次html文件打包插件，通过chunks:['index']来规定页面引入的js文件是哪些

    4.css文件只要在js文件中引入即可(一个js文件引用的多个css、less、scss文件都会在打包时编译成一个css文件)
 */

 
 //压缩打包html\js\css文件
 /*
    1.webpack设置成生产模式：mode:'production'，html(因为安装了html打包插件)、js文件就会自动压缩(变成一行)
    
    2.html文件在开发模式下也可以通过实例化html打包插件中添加minify:{...}来设置成压缩格式

    3.css压缩文件则需要下载插件  optimize-css-assets-webpack-plugin
  */

  
  //devtool
  /*
    设置source-map可以让打包后的代码映射到源文件
   */
//   let a = b;


//watch监听
/* 
    打包修改源文件（html\js\css），watch文件监听会帮助我们修改打包后的文件，从而自动更新
 */


//clean清理
/*
    因为修改完配置文件即webpack.config.js后需要重新打包，但是打包文件是覆盖安装，会造成上一次打包留下来的无用目录和文件
    clean清理插件可以帮助我们每次打包时，会先清理一遍之前的打包文件
    步骤：
      1.安装clean插件 clean-webpack-plugin
      2.在plugin中实例化一个CleanWebpackPlugin()
 */

//Axios跨域请求
 /* 
    本地开发阶段会遇到不同源（ip、域名）的资源不可以访问
    而打包后文件放在同一个服务端是不存在这样的问题,所以我们只需要在devserver中配置代理即可
    提供两个远程json文件，通过返回的数据测试跨域问题
    http://cdn.liyanhui.com/data.json  (设置过，可跨域)
    http://cdn.ycku.com/data.json      (不可跨域，默认)
   
    步骤：
      1.下载axios包
      2.将不可跨域的地址写成虚拟目录
      3.在devserver中配置 proxy 代理
  */
  //可以直接使用的跨域地址
  /* import axios from 'axios';
  axios.get('http://cdn.liyanhui.com/data.json').then(res=>console.log(res.data)); */

  //需要配置过的跨域地址
  import axios from 'axios';
  axios.get('http:/api/data.json').then(res=>console.log(res.data));
  //替换需要代理的url为一个虚拟目录，如'/api'，然后在devServer中匹配虚拟目录进行代理
  //PS:在打包文件中这里会报错，因为打包文件中并没有devServer代理对目录进行代理

  //dist 服务
  //打包后，我们想要在静态服务器上测试，先要安装静态服务器；
  //npm i serve -g  //安装(已安装)
  //serve dist -s  //运行dist目录
  //PS:在vscode 中我安装了live Server插件也可以实现模拟本地服务器运行代码

  //环境分离设置在项目 WebpackStudyfl


  