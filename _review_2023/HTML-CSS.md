# HTML/CSS

## src/href

- src: source，请求外部资源的来源地址，指向的内容会嵌入到文档中当前标签所在位置。当浏览器解析到该元素时，会暂停其他资源下载，直到将该资源加载、编译、执行完毕。
- href: hyper reference，超链接，会并行下载资源，不会停止对当前文档的处理。

## iframe

- 可以用来处理加载缓慢的内容
- 会阻塞主页面的onLoad事件
- iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
  - 可以通过js动态给iframe添加src属性值来解决这个问题
- 会产生很多页面，不易管理
- 浏览器的后退按钮没有作用
- 无法被搜索引擎识别

## 怪异模式、标准模式

没有写docType会进入怪异模式：盒模型差异、设置行内元素的宽高、用margin:0设置水平居中失败、设置百分比高度

## 图片热区技术？

```html
<img src="xxxx" usemap="#Map"/>
<map name="x">
  <area />
</map>
```

## px/em/rem/vh/vw

像素、相对长度（相对于父元素的fontSize）、rem（相对于根元素html的fontSize）
可视窗口高度、可视窗口宽度

## BFC、IFC、GFC、FFC

- BFC：块级格式上下文
  - 设置浮动、overflow设置为auto/scroll/hidden、position设置为absolute/fixed
  - 解决浮动令父元素高度塌陷问题
  - 解决非浮动元素被浮动元素覆盖问题
  - 解决外边距垂直方向重合的问题
- IFC：行内格式上下文
- GFC：网格布局格式上下文
- FFC：弹性格式上下文

## flex

flex属性简写：flex-grow，flex-shrink，flex-basis

## opacity、visibility、display

- display
  - 会从渲染树中消失，不占空间，不能点击
  - 非继承属性，子孙都不可见
  - 重排
- visibility
  - 不会消失，继续占据空间，不能点击
  - 继承属性，子孙修改可以显示
  - 重绘
- opacity
  - 不会消失，继续占据空间，可以点击
  - 非继承属性，子孙都不可见
  - 重绘

## 多行文本溢出

```css
div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
div {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

## 居中问什么用transform

transform是合成属性，会创建一个合成层，不会引起整个页面的重排。
top/left是布局属性，会导致重排。

## transition、animation

transition过渡动画
animation关键帧动画

## sticky

在屏幕范围内时元素的位置不受定位影响，要移动出便宜范围时，定位会变成fixed。不脱离文档流。相对偏移是相对于理它最近的具有滚动框的祖先元素。如果祖先元素都不可以滚动，那么相对于viewport计算。

## 三角形

```css
div {
  width: 0;
  height: 0;
  border: 10px solid red;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
```

## 自适应正方形

```css
.square {
  width: 10vw;
  height: 10vw;
}
.square {
  width: 10%;
  padding-bottom: 10%;
  height: 0;
}
```

## 清除浮动

:after伪元素

## 盒模型

- W3C盒模型：宽高不包含内边距和边框
- IE盒模型：宽高包含内边距和边框


