## 内容可见性

### 屏幕外元素是否渲染
content-visibility: visible | auto | hidden;

### 确保元素的正确渲染固有尺寸范围
contain-intrinsic-size: 200px;

## will-change

### 表明元素将修改特定的属性，让浏览器事先进行必要的优化(GPU)
will-change: auto | scroll-position | content | \<custom-ident\>

custom-ident表示要改变的元素属性，比如padding、margin、opacity等等。

如果你滥用的话，反而会降低Web的性能。

建议在父元素上使用will-change，在子元素上使用动画。

建议在完成所有动画后，将元素的will-change删除。

- 在样式表中少用will-change
- 给will-change足够的时间令其发挥该有的作用
- 使用\<custom-ident\>来针对超特定的变化（如，- left, opacity等）
- 如果需要的话，可以JavaScript中使用它（添加和删除）
- 修改完成后，删除will-change
- 不要同时声明太多的属性
- 不要应用在太多元素上
- 不要把资源浪费在已停止变化的元素上

## 让元素及其内容尽可能独立于文档树的其余部分（contain）

在实际使用的时候，我们可以通过contain设置下面五个值中的某一个来规定元素以何种方式独立于文档树：

- layout ：该值表示元素的内部布局不受外部的任何影响，同时该元素以及其内容也不会影响以上级
- paint ：该值表示元素的子级不能在该元素的范围外显示，该元素不会有任何内容溢出（或者即使溢出了，也不会被显示）
- size ：该值表示元素盒子的大小是独立于其内容，也就是说在计算该元素盒子大小的时候是会忽略其子元素
- content ：该值是contain: layout paint的简写
- strict ：该值是contain: layout paint size的简写

## 使用font-display解决由于字体造成的布局偏移（FOUT）

font-display: auto | block | swap | fallback | optional

```css
@font-face {
    font-family: "Open Sans Regular";
    font-weight: 400;
    font-style: normal;
    src: url("fonts/OpenSans-Regular-BasicLatin.woff2") format("woff2");
    font-display: swap;
}
```

注意，font-display一般放在@font-face规则中使用。

## scroll-behavior让滚动更流畅

scroll-behavior: auto | smooth | inherit | initial | unset

```css
html {
    scroll-behavior:smooth;
}
```

## 开启GPU渲染动画

## 减少渲染阻止时间

```html
<!-- style.css contains only the minimal styles needed for the page rendering -->
<link rel="stylesheet" href="styles.css" media="all" />

<!-- Following stylesheets have only the styles necessary for the form factor -->
<link rel="stylesheet" href="sm.css" media="(min-width: 20em)" />
<link rel="stylesheet" href="md.css" media="(min-width: 64em)" />
<link rel="stylesheet" href="lg.css" media="(min-width: 90em)" />
<link rel="stylesheet" href="ex.css" media="(min-width: 120em)" />
<link rel="stylesheet" href="print.css" media="print" />
```

## 避免@import包含多个样式表

关于 @import 的关键事实是，它是一个阻塞调用，因为它必须通过网络请求来获取文件，解析文件，并将其包含在样式表中。如果我们在样式表中嵌套了 @import，就会妨碍渲染性能。

与使用 @import 相比，我们可以通过多个 link 来实现同样的功能，但性能要好得多，因为它允许我们并行加载样式表。

## 注意动态修改自定义属性方式

