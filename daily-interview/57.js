// 结构
// display：none
会让元素完全从渲染树中消失，渲染的时候不占据任何空间，不能点击。
// visibility：hidden
不会让元素从渲染树中小时，渲染元素继续占据空间，只是内容不可见，不能点击
// opacity：0
不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，可以点击

// 继承
display：none和opacity：0是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。
visibility：hidden是继承属性，子孙节点消失由于继承了hidden，通过设置visibility：visible可以让子孙节点显示。

// 性能
display：none修改元素会造成文档回流，性能消耗较大，读屏器不会读取该元素内容
visibility：hidden修改元素只会造成重绘，性能消耗较少，读屏器会读取该元素内容
opacity：0修改元素会造成重绘，性能消耗较小