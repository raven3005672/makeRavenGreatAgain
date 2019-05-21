<!-- https://www.youtube.com/watch?v=Gc9-7PBqOC8&list=LLHK1mTHpwrUeYgF5gu-Kd4g -->
<!-- https://zhuanlan.zhihu.com/p/58151131 -->

createAsset("./example/entry.js");
返回AST树数据结构，包含：模块id，文件路径filename，依赖数组dependencies，code【es6转5的代码】

遍历dependencies数组，循环调用createAsset就可以得到全部模块相互依赖的信息。
想得到全部依赖信息需要调用createGraph这样一个函数，它会进行广度遍历，最终返回一个数组，数组的每一项增加了一个mapping，把当前模块依赖的文件名称和模块id做一个映射，目的是为了更方便查找模块。

bundle函数返回我们构造的字符串
