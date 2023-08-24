## 获取元素位置和尺寸信息

getBoundingClientRect

## 异步监听一个或多个目标元素与其祖先元素或视窗之间的交叉状态

intersectionObserver

## 遍历文档树中得有一组DOM节点

createNodeIterator

```js
const body = document.getElementsByTagName('body')[0]
const item = document.createNodeIterator(body)//让body变成可遍历的
let root = item.nextNode() // 下一层

while (root) {
    console.log(root);
    if (root.nodeType !== 3) {
        root.setAttribute('data-index', 123)//给每个节点添加一个属性
    }
    root = item.nextNode()
}
```

## 获取当前元素所有最终使用的CSS属性值

getComputedStyle

```js
const box = document.getElementById('box')
const style = window.getComputedStyle(box, 'after')

const height = style.getPropertyValue('height')
const width = style.getPropertyValue('width')

console.log(style);
console.log(width, height);
```

## 在下一次浏览器重绘之前调用指定函数的方法

requestAnimationFrame

set系列方法不会考虑浏览器的重绘，可能会被延迟执行，从而影响动画的流畅度