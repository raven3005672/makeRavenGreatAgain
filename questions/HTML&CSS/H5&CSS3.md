# H5和CSS3新特性

## H5新特性

语义化标签

* header    定义了文档的头部区域
* footer    定义了文档的尾部区域
* nav       定义文档的导航
* section   定义文档中的节（section、区段）
* article   定义页面独立的内容区域
* aside     定义页面的侧边栏内容
* detailes  用于描述文档或文档某个部分的细节
* summary   标签包含details元素的标题
* dialog    定义对话框，比如提示框

增强型表单

HTML5拥有多个新的表单input输入类型，这些新特性提供了更好的输入控制和验证

* color     主要用于选取颜色
* date      从一个日期选择器选择一个日期
* datetime  选择一个日期（UTC时间）
* email     包含e-mail地址的输入域
* month     选择一个月份
* number    数值的输入域
* range     一定范围内数字值的输入域
* search    用于搜索域
* tel       定义输入电话号码字段
* time      选择一个时间
* url       URL地址的输入域
* week      选择周和年

新增以下表单元素

* datalist  元素规定输入域的选项列表，使用input元素的list属性与datalist元素的id绑定
* keygen    提供一种验证用户的可靠方法，标签规定用于表单的密钥对生成器字段
* output    用于不同类型的输出，比如计算或脚本输出

新增的表单属性

* placeholder   简短的提示在用户输入值前会显示在输入域上，即我们常见的输入框默认提示，在用户输入后消失
* required      是一个boolean属性，要求填写的输入域不能为空
* pattern       描述了一个正则表达式用于验证input元素的值
* min/max       设置元素最小值与最大值
* step          为输入域规定合法的数字间隔
* height/width  用于image类型的input标签的图像高度和宽度
* autofocus     是一个boolean属性，规定在页面加载时，域自动地获得焦点
* multiple      是一个boolean属性，规定input元素中可选择多个值

新事件

* onresize      当调整窗口大小时运行脚本
* ondrag        当拖动元素是运行脚本
* onscroll      当滚动元素的滚动条时运行脚本
* onmousewheel  当转动鼠标滚轮时运行脚本
* onerror       当错误发生时运行脚本
* onplay        当媒介数据将要开始播放时运行脚本
* onpause       当媒介数据暂停时运行脚本

块级元素

div/p/h1-h6/ul/ol/dl/li/dd/table/hr/blockquote/address/menu/pre/header/section/aside/footer

行内元素

pan/img/a/lable/input/abbr【缩写】/em【强调】/big/cite【引用】/i【斜体】/q【短引用】/textarea/select/small/sub/sup/strong/u【下划线】/button

音频视频：audio、video
canvas
地理定位
拖拽
本地存储：localStorage - 没有时间限制的数据存储；sessionStorage - 针对一个 session 的数据存储，当用户关闭浏览器窗口后，数据会被删除
WebSocket：单个 TCP 连接上进行全双工通讯的协议

## CSS3新特性

选择器

* :last-child           选择元素最后一个孩子
* :first-child          选择元素第一个孩子
* :nth-child(1)         按照第几个孩子给它设置样式
* :nth-child(even)      按照偶数
* :nth-child(odd)       按照奇数
* :disabled             选择每个禁用的E元素
* :checked              选择每个被选中的E元素
* :not(selector)        选择非selector元素的每个元素
* ::selection           选择被用户选取的元素部分

伪类和伪元素：
根本区别在于它们是否创造了新的元素

伪类：用于向某些选择器添加特殊的效果（没有创建新元素）

* :last-child           选择元素最后一个孩子
* :first-child          选择元素第一个孩子
* :nth-child(1)         选择第几个孩子给它设置样式
* a:link                未访问的链接
* a:visited             已访问的链接
* a:hover               鼠标移动到链接上
* a:active              选定的链接

伪元素：创建了html中不存在的元素，用于将特殊的效果添加到某些选择器

* ::before              选择器在被选元素的前面插入内容和定义css，使用content属性来指定要插入的内容
* ::after               选择器在被选元素的后面插入内容和定义css，使用content属性来指定要插入的内容
* :first-letter         选择该元素内容的首字母
* :fist-line            选择该元素内容的首行
* ::selection           选择被用户选取的元素部分

背景和边框

背景：

* background-size       规定背景图片的尺寸（cover：填充；100% 100%：拉伸）
* background-origin     规定背景图片的定位区域（content-box、padding-box、border-box）

边框：

* border-radius             圆角
* box-shadow/text-shadow    阴影
* border-image              边框图片

文本效果

* text-shadow           向文本添加阴影
* text-justify          规定当text-align设置为justify时所使用的对齐方法
* text-emphasis         向元素的文本应用重点标记以及重点标记的前景色
* text-outline          规定文本的轮廓
* text-overflow         规定当文本溢出包含元素时发生的事情
* text-wrap             规定文本的换行规则
* word-break            规定非中日韩文本的换行规则
* word-wrap             允许对长的不可分割的单词进行分割并换行到下一行
* text-decoration       文本修饰符：overline、line-throuth、underline分别是上划线、中划线、下划线

@font-face  自定义字体

渐变

CSS3新增了渐变效果，包括linear-gradient线性渐变和radial-gradient径向渐变

2D/3D转换（transform）

2D转换

* translate()           元素从其当前位置移动，根据给定的left（x坐标）和top（y坐标）位置参数。transform: translate(50px, 100px)
* rotate()              元素顺时针旋转给定的角度。若为负值，元素将逆时针旋转。transform: rotate(30deg)
* scale()               元素的尺寸会增加或减少，根据给定的宽度（x轴）和高度（y轴）参数，也可以一个值（宽高）。transform: scale(2,4)
* skew()                元素翻转给定的角度，根据给定的水平线（x轴）和垂直线（y轴）参数。transform: skew(30deg, 20deg)
* matrix()              把所有2D转换方法组合在一起，需要六个参数，包括数学函数，允许：旋转、缩放、移动以及倾斜元素。transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0)

3D转换

* rotateX()             元素围绕其X轴以给定的度数进行旋转。transform: rotateX(120deg)
* rotateY()             元素围绕其Y轴以给定的度数进行旋转。transform: rotateY(130deg)
* perspective           规定3D元素的透视效果

动画、过渡

过渡（transition）：使页面变化更平滑，以下参数可直接写在transition后面

* transition-property           执行动画对应的属性，例如color，background等，可以使用all来指定所有的属性
* transition-duration           过渡动画的一个持续时间
* transition-timing-function    在延续时间段，动画变化的速率，常见的有：ease/linear/ease-in/ease-out/ease-in-out/cubic-bezier
* transition-delay              延迟多久后开始动画

动画（animation）

先定义@keyframes规则（0, 100%|from, to），然后定义animation，以下参数可直接写在animation后面

* animation-name                定义动画名称
* animation-duration            指定元素播放动画所持续的时间长
* animation-timing-function     ease/linear/ease-in/ease-out/ease-in-out/cubic-bezier: 指元素根据
* animation-delay               指定元素动画开始时间
* animation-iteration-count     infinite|number: 指定元素播放动画的循环次数
* animation-direction           normal|alternate: 指定元素动画播放的方向，只有两个值，默认值为normal，如果设置为normal时，动画的每次循环都是向前播放；另一个值是alternate，规定动画在下一周期逆向地播放
* animation-play-state          running|paused: 控制元素动画的播放状态

多列布局

* column-count          规定元素应该被分割的列数
* column-gap            规定列之间的间隔
* column-rule           设置列之间的宽度、样式和颜色规则

用户界面：CSS3中，新的用户界面特性包括重设元素尺寸、盒尺寸以及轮廓灯

* resize
* box-sizing
* outline-offset

resize 属性规定是否可由用户调整元素尺寸。如果希望此属性生效，需要设置元素的 overflow 属性，值可以是 auto、hidden 或 scroll
```
div {
  resize: both; /* none|both|horizontal|vertical; */
  overflow: auto;
}
```

box-sizing 属性可设置的值有 content-box、border-box 和 inherit
content-box 是W3C的标准盒模型，元素宽度 = 内容宽度 + padding + border：意思是 padding 和 border 会增加元素的宽度，以至于实际上的 width 大于原始设定的 width
border-box 是ie的怪异盒模型，元素宽度 = 设定的宽度，已经将 padding 和 border 包括进去了，比如有时候在元素基础上添加内距 padding 或 border 会将布局撑破，但是使用 border-box 就可以轻松完成
inherit：规定应从父元素继承 box-sizing 属性的值

outline-offset 属性对轮廓进行偏移，并在超出边框边缘的位置绘制轮廓

CSS 兼容内核

* -moz-：代表FireFox浏览器私有属性
* -ms-：代表IE浏览器私有属性
* -webkit-：代表safari、chrome浏览器私有属性
* -o-：代表opera浏览器私有属性
