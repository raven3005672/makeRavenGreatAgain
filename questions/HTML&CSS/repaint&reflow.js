// 渲染机制
// 浏览器采用流式布局模型，把HTML解析成DOM，CSS解析成CSSOM，DOM和CSSOM合并就产生了渲染树RenderTree。
// 一般来说，对RenderTree的计算通常只需要遍历一次就可以完成，但table及其内部元素除外，他们可能需要多次计算，通常要花3倍与同等元素的时间，所以要避免使用table布局。


// 重绘
// 由于节点的几何属性发生改变或者由于样式发生改变而不会影响布局的，称为重绘。
// 例如outline，visibility，color，background-color等，重绘的代价是高昂的，因为浏览器必须验证DOM树上其他节点元素的可见性。

// 回流
// 回流是布局或者几何属性需要改变就称为回流。回流是影响浏览器性能的关键因素，因为其变化涉及到部分页面（或是整个页面）的布局更新。
// 一个元素的回流可能会导致了其所有子元素以及DOM中紧随其后的节点、祖先节点元素的随后的回流。
// 大部分的回流将导致页面的重新渲染。

// 回流必定会发生重绘，重绘不一定会引发回流。


// 浏览器优化
// 现代浏览器大多是通过队列机制来批量更新布局，浏览器会把修改操作放在队列中，至少一个浏览器刷新（即16.6ms）才会清空队列。
// 但当你获取布局信息的时候，队列中可能会有影响这些属性或方法返回值的操作，即使没有，浏览器也会强制清空队列，触发回流与重绘来确保返回正确的值。
// 主要包括以下属性或方法
offsetTop, offsetLeft, offsetWidth, offsetHeight
scrollTop, scrollLeft, scrollWidth, scrollHeight
clientTop, clientLeft, clientWidth, clientHeight
width, height
getComputedStyle()
getBoundingClientRect()
// 避免频繁使用上述的属性，他们都会强制渲染刷新队列。


// 减少重绘与回流
// CSS
// 使用transform替代top
// 使用visibility替代display: none，前者只会引起重绘，后者会引发回流（改变了布局）
// 避免使用table布局，可能很小的一个小改动会造成整个table的重新布局
// 尽可能在DOM树的最末端改变class，回流是不可避免的，但可以减少其影响。尽可能在DOM树的最末端改变class，可以限制回流的范围，使其影响尽可能少的节点。
// 避免设置多层内联样式，CSS选择符从右往左匹配查找，避免节点层级过多。
// 将动画效果应用到position属性为absolute或fixed的元素上，避免影响其他元素的布局，这样只是一个重绘，而不是回流。同时，控制动画速度可以选择requestAnimationFrame。
// 避免使用CSS表达式，可能会引发回流。
// 将频繁重绘或者回流的节点设置为图层，图层能够阻止该节点的渲染行为影响别的节点，例如will-change、video、iframe等标签，浏览器会自动将该节点变为图层。
// CSS3硬件加速（GPU加速），使用css3硬件加速，可以让transform、opacity、filters这些动画不会引起回流重绘。但是对于动画的其他属性，比如background-color这些，还是会引起回流重绘的，不过他还是可以提升这些动画的性能。

// JavaScript
// 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
// 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。
// 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
// 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引发父元素及后续元素频繁回流。

