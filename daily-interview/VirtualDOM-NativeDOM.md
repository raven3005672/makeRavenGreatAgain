# VirtualDOM-NativeDOM

1. 性能 vs. 可维护性
    框架的意义在于掩盖底层的DOM操作，用更声明式的方式来描述目的，使代码更容易维护。
    没有任何框架可以比纯手动的优化DOM操作更快。
2. 对React的Virtual DOM的误解
    如果没有Virtual DOM，重置整个innerHTML是很大的资源浪费。
    innerHTML: render html string O(template size) + 重新创建所有DOM元素 O(DOM size)
    VirtualDOM: render Virtual DOM + diff O(template size) + 必要的DOM更新 O(DOM change)
    VirtualDOM的意义在于，不管数据变化多少，每次重绘的性能都可以接受；依然可以用类似于innerHTML的思路来写应用
3. MVVM vs. VirtualDOM
    相比于React，其他MVVM框架采用的都是数据绑定，观察数据变化并保留对实际DOM元素的引用，当有数据变化时进行对应的操作。
    MVVM的变化检查是数据层面的，而React的检查是DOM结构层面的。
4. 性能比较
    初始渲染：VirtualDOM > 脏检查 >= 依赖收集
    小量数据更新：依赖收集 >> VirtualDOM + 优化 > 脏检查 > VirtualDOM
    大量数据更新: 脏检查 + 优化 >= 依赖收集 + 优化 > VirtualDOM >> MVVM

VirtualDOM真正的价值不是性能，而是：1函数式UI编程，2渲染到DOM之外的backend【比如RN】

主流的框架+合理的优化，足以应对绝大部分应用的性能需求。如果是对性能有极致需求的特殊情况，其实应该牺牲一些可维护性才去手动优化：比如Atom编辑器在文件渲染的实现上放弃了React而采用了自己实现的tile-based rendering；又比如在移动端需要DOM-pooling的虚拟滚动，不需要考虑顺序变化，可以绕过框架的内置实现自己搞一个。

<!-- https://www.zhihu.com/question/31809713/answer/53544875 -->
