问题1：webpack中，module，chunk和bundle的区别是什么？
首先在src目录下写业务代码，引入index.js、utils.js、common.js、index.css
编译结果见图1
1对于一份同逻辑的代码，当我们手写一下一个的文件，它们无论是ESM还是commonJS或是AMD，他们都是module；
2当我们写的module源文件传到webpack进行打包时，webpack会根据文件引用关系生成chunk文件，webpack会对这个chunk文件进行一些操作；
3webpack处理好chunk文件后，最后会输出bundle文件，这个bundle文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一句话总结：
module，chunk和bundle其实就是同一份逻辑代码在不同转换场景下的取了三个名字：
我们直接写出来的是module，webpack处理时是chunk，最后生成浏览器可以直接运行的bundle。



问题2：filename和chunkFilename的区别
filename是一个很常见的配置，就是对应于entry里面的输入文件，经过webpack打包后输出文件的文件名。
chunkFilename指违背列在entry中，却又需要被打包出来的chunk文件的名称。一般来说，这个chunk文件指的就是要懒加载的代码。

一句话总结：
filename指列在entry中，打包后输出的文件的名称。
chunkFilename指未列在entry中，却又需要被打包出来的文件的名称。



问题3：webpackPrefetch，webpackPreload和webpackChunkName到底是干什么的？
webpackChunkName
可以在import文件时，在import里以注释的形式为chunk文件取别名。
webpackPrefetch和webpackPreload
preload为预拉取，prefetch为预加载。
import时候添加webpackPrefetch，webpack会在父chunk完成加载后，闲时加载lodash文件。
webpackPreload是预加载当前导航下可能需要资源，它和webpackPrefetch的主要区别是：
preload chunk会在父chunk加载时，以并行方式开始加载。prefetch chunk会在父chunk加载结束后加载。
preload chunk具有中等优先级，并立即下载。prefetch chunk在浏览器闲置时下载。
preload chunk会在父chunk中立即请求，用于当下时刻，prefetch chunk回用于未来的某个时刻。

一句话总结：
webpackChunkName是为预加载的文件取别名，webpackPrefetch会在浏览器闲置下载文件，webpackPreload会在父chunk加载时并行下载文件。



问题4：hash、chunkhash、contenthash有什么不同？
hash
hash计算是跟整个项目的构建相关，生成文件的hash和项目的构建hash都是一模一样的。
chunkhash
chunkhash根据不同的入口文件（entry）进行以来文件解析，构建对应的chunk，生成对应的哈希值。
contenthash
contenthash将根据资源内容构建出唯一hash，也就是说文件内容不变，hash就不变。

一句话总结：
hash计算与整个项目的构建相关；chunkhash计算与同一chunk内容相关；contenthash计算与文件内容本身相关。



问题5：source-map中eval、cheap、inline和module各是什么意思？
source-map就是一份源码和转换后代码的映射文件。
cheap-source-map，不会产生列映射，相应的体积会小很多。
eval-source-map，会以eval函数打包运行模块，不产生独立的map文件，会显示报错的行列信息。
inline-source-map，映射文件以base64格式编码，加在bundle文件最后，不产生独立的map文件。
常用配置：
1.source-map
大而全，什么都有，构建时间较长，看情况使用。
2.cheap-module-eval-source-map
一般是开发环境推荐使用，在构建速度报错提醒上做了比较好的均衡。
3.cheap-module-source-map
一般来说，生产环境是不配source-map的，如果想捕捉线上的代码报错，我们可以用这个。
