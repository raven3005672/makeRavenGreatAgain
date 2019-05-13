npm install -g webpack

npm init
    => package.json

npm install --save-dev webpack
npm install --save-dev webpack-cli

# {extry file}出填写入口文件的路径，本文中就是上述main.js的路径，
# {destination for bundled file}处填写打包文件的存放路径
# 填写路径的时候不用添加{}
webpack {entry file} {destination for bundled file}

webpack.config.js
entry入口文件
output打包输出文件

package.json中修改script对象如下
  "scripts": {
    "start": "webpack"
  }
执行npm start即为执行webpack

npm start是一个特殊的脚本名称，其特殊性表现在，在命令行中使用npm start就可以执行其对应的命令，如果对应的此脚本名称不是start，想要在命令行中运行时，需要这样用npm run {script name}如npm run build。

webpack配置文件中配置source maps，需要配置devtool，有以下四种
source-map，在一个单独的文件中产生一个完整切功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度。
cheap-module-source-map，在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便。
eval-source-map，使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的js文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要弃用这个选项。
cheap-module-eval-source-map，这是打包文件时最快的生成source map的方法，生成的source map会和打包后的javascript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点。

中小型项目中，eval-source-map是一个很好的选项，不过只应该在开发阶段使用它。
cheap-module-eval-source-map构建速度更快，但是不利于调试，推荐在大型项目考虑时间成本时使用。

使用webpack构建本地服务器webpack-dev-server
npm install --save-dev webpack-dev-server
详细配置参考
<!-- https://webpack.js.org/configuration/dev-server/ -->
contentBase，默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录。
port，设置默认监听端口，如果省略，默认为8080。
inline，设置为true，当源文件改变时会自动刷新页面。
historyApiFallback，在开发但也应用是非常有用，它依赖于HTML5historyAPI，如果设置为true，所有的跳转将指向index.html


loaders
通过使用不同的loader，webpack有能力调用外部的脚本或工具，实现对不同格式的文件的处理，比如说分析转换scss为css，或者把下一代的js文件转换为现代浏览器兼容的js文件，对react的开发而言，合适的loaders可以吧react中用到的jsx文件转换为js文件。
loaders需要单独安装并且需要在webpack.config.js中的modules关键字下进行配置，loaders的配置包括以下几方面：
test：一个用以匹配loaders所处理文件的扩展名的正则表达式（必须）
loader：loader的名称（必须）
include/exclude：手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
query：为loaders提供额外的设置选项（可选）


Babel
Babel其实是一个编译JavaScript的平台，它可以编译代码帮你达到以下目的：
让你能使用最新的javascript代码，而不用管新标准是否被当前使用的浏览器完全支持；
让你能使用基于javascript进行扩展的语言，比如React的jsx

Babel的安装与配置
Babel其实是几个模块化的包，其核心功能位于babel-core的npm包中，webpack可以把其不同的包整合在一起使用，对于每一个你需要的功能或扩展，你都需要安装单独的包（用得最多的是解析es6的babel-env-preset包和解析jsx的babel-preset-react包）

npm一次性安装多个依赖模块，模块之间用空格隔开
npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react

babel可以单独配置在.babelrc文件中，webpack会自动调用.babelrc里的babel配置选项

webpack把所有的文件都当做模块处理，javascript代码，css和ftons以及图片等等通过合适的loader都可以被处理。
CSS
webpack提供两个工具处理样式表，css-loader和style-loader，二者处理的任务不同，css-loader使你能够使用类似@import和url(...)的方法实现require()的功能，style-loader将所有的计算后的样式加入页面中，二者组合在一起使你能够吧样式表嵌入webpack打包后的js文件中。
npm install --save-dev style-loader css-loader

CSS module
模块化发展非常迅速，模块使得开发者把复杂的代码转化为小的，干净的，依赖声明明确的单元，配合优化工具，依赖管理和加载管理可以自动完成。
CSS module技术意在把js的模块化思想带入css中来，通过css模块，所有的类名，动画名默认都只作用于当前模块。webpack对css模块化提供了非常好的支持，只需要在css loader中进行简单配置即可，然后就可以直接把css的类名传递到组件的代码中，这样做有些哦避免了全局污染。

CSS预处理器
Sass和Less之类的预处理器是对原生CSS的扩展，它们允许你使用类似于variables,nesting,mixins,inheritance等不存在于css中的特性来写css，css预处理器可以将这些特殊类型的语句转化为浏览器可识别的css语句。
常见的css处理loaders：Less Loader,Sass Loader,Stylus Loader

插件Plugins
插件Plugins是用来扩展webpack功能的，它们会在整个构建过程中生效，执行相关的任务。
Loaders和Plugins常常被弄混，但是他们其实是完全不同的东西，可以这么来说，loaders是在打包构建过程中用来处理源文件（jsx，scss，less），一次处理一个，插件并不直接操作单个文件，它对整个构建过程起作用。

使用插件的方法
要使用某个插件，我们需要通过npm安装它， 然后要做的就是在webpack配置中的plugins关键字部分添加该插件的一个实例（plugins是一个数组）继续上面的例子，我们添加了一个给打包后代码添加版权声明的插件。
HtmlWebpackPlugin
这个插件的作用是依据一个简单的index.html模板，生成一个自动引用你打包后的js文件的新index.html。这在每次生成的js文件名称不同时非常有用（比如添加了hash值）。
HotModuleReplacement
HMR也是webpack里很有用的一个插件，它允许你在修改组件代码后，自动刷新实时浏览修改后的效果。
在webpack中实现HMR也很简单，只需要做两项配置：在webpack配置文件中添加HMR插件；在webpackDEVSever中添加hot参数
不过配置玩这些后，JS模块其实还是不能自动热加载的，还需要在你的JS模块中执行一个webpack提供的API才能实现热加载，虽然这个API不难使用，但是如果是React模块，使用我们已经熟悉的Bable可以更方便的实现功能热加载。
Babel有一个叫做react-transform-hrm的插件，可以在不对React模块进行额外的配置的前提下让HMR正常工作；
npm install --save-dev babel-plugin-react-transform react-transform-hmr

产品阶段的构建
webpack.production.config.js =》 devtool参数为'null'

优化插件
OccurenceOrderPlugin：为组件分配ID，通过这个插件webpack可以分析和优化考虑使用最多的模块，并为它们分配最小的ID
UglifyJsPlugin：压缩JS代码
ExtractTextPlugin：分析css和js文件

去除build文件中的残余文件
添加了hash之后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多，因此这里介绍另外一个很好用的插件clean-webpack-plugin
npm install clean-webpack-plugin --save-dev

