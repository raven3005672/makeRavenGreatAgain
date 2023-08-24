## 优化构建速度

定向查找、减少执行构建的模块、并行构建以提升总体速度、并行压缩提高构建效率、合理使用缓存

### 定向查找

- resolve.modules 指向node_modules的绝对路径
- resolve.extensions 文件后缀配置

### 减少执行构建的模块

- 合理配置noParse 忽略没有模块化的文件，比如jquery、lodash
- 合理配置IgnorePlugin 忽略moment中的多语言目录local
- 合理配置externals 无需打包哪些文件
- 合理配置loader的include、exclude

### 并行构建以提升总体速度

- HappyPack 多进程
- Thread-loader 类似

### 并行压缩提高构建效率

- uglifyjs-webpack-plugin 和 terser-webpack-plugin 开启 paralle
- ParallelUglifyPlugin (已过时)

### 合理使用缓存

- babel-loader开启缓存
- cache-loader
- HardSourceWebpackPlugin (已过时)
- webpack5 配置 cache.type
  
## 优化构建结果

压缩代码、按需加载、提前加载、Code Splitting、Tree Shaking、Gzip、作用提升

### 压缩代码

- 压缩 html 使用的还是 html-webpack-plugin 插件
- 压缩 css css-minimizer-webpack-plugin
- 压缩 js uglifyjs-webpack-plugin 和 terser-webpack-plugin （生产环境默认）
- 压缩 image 自动帮我们做好图片压缩，这个时候我们就可以借助 image-webpack-loader 帮助我们来实现，基于 imagemin 这个 Node 库来实现图片压缩的。

### 按需加载

import().then()

### 提前加载（prefetch 和 preload）

prefetch 与 preload 的区别

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
- 浏览器支持程度不同，需要注意。

### Code Splitting (代码分割)

module => chunk => bundle

- SplitChunksPlugin
- MiniCssExtractPlugin（style-loader会把css打包进js文件里面）


### Tree Shaking

- tree shaking
  - 配置 usedExports: true
  - package.json 配置sideEffects: ["@babel/polly-fill"]
- CSS tree shaking
  - purgecss-webpack-plugin

### Gzip

compression-webpack-plugin

### 作用提升 (Scope Hoisting)

new webpack.optimize.ModuleConcatenationPlugin()

## 常用分析工具

第一个是时间分析工具是 speed-measure-webpack-plugin

第二个是构建结果产物分析工具 webpack-bundle-analyzer 





