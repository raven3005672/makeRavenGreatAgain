### 回流触发条件 reflow

回流这一阶段主要是计算节点的位置和几何信息，那么当页面布局和几何信息发生变化的时候，就需要回流。
- 一个DOM元素的几何属性变化，常见的几何属性有width、height、padding、margin、left、top、border等等
- 使DOM节点发生增减或移动
- 读写offset家族、scroll家族、client家族属性的时候，浏览器为了获取这些值，需要进行回流操作
- 调用window.getComputedStyle方法

### 重绘触发条件 repaint

重绘是一个元素外观的改变所触发的浏览器行为，例如改变visibility、outline、background-color等属性，这些属性只影响元素的外观，风格，并且没有影响几何属性的时候，会导致重绘。

### 像素管道

JavaScript => Style样式计算 => Layout布局 => Paint绘制 => Composite合成

回流：（也就是为什么回流一定触发重绘）
JavaScript => Style样式计算 => Layout布局 => Paint绘制 => Composite合成
重绘：
JavaScript => Style样式计算 =>           => Paint绘制 => Composite合成
提升合成层：
JavaScript => Style样式计算 =>           =>           => Composite合成

[CSS触发器](https://csstriggers.com/)

### 如何减少回流与重绘

- 减少强制同步布局
- 避免频繁操作DOM
- 开启GPU加速（GPU加速元素会被单独提升到一层）
- 如何开启硬件加速
  - will-change
  - translateZ(0)
- 不要滥用硬件加速（存在隐式合成）
- 使用requestAnimationFrame
  - 要求浏览器在下次重绘之前调用指定的回调函数
  - 不要在回调函数里调用会触发强制同步布局的属性或者方法
- 使用requestIdleCallback
  - 在浏览器的空闲时段内调用的函数
- 其他
  - 动画效果应用到position属性为absolute或fixed的元素上，给z-index层级变高
  - top left使用transform代替
  - 避免使用CSS表达式calc
  - 使用性能更高的选择器，如类选择器。同事可以选择性使用BEM（块、元素、修饰符）规范