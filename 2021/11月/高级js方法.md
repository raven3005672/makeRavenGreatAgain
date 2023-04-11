
- getBoundingClientRect 监听某个元素与视口的交叉状态（引起回流重绘）
- IntersectionObserver 异步观察目标元素与其祖先元素或顶级文档视窗交叉状态的方法（不引起回流重绘）
- createNodeIterator 遍历输出页面中的所有元素
- getComputedStyle 返回一个对象，对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有的CSS属性的值
- requestAnimationFrame 告诉浏览器希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
- requestIdleCallback 当前浏览器处于空闲状态，执行回调函数
- DomContentLoaded 初始的HTML文档被完全加载和解析完成之后，该事件被重复啊，而无需等待样式表、图像和子框架的完全加载。
- MutationObserver 观察DOM对象，并在检测到更改时触发回调
- Promise.any 只要一个promise成功，就返回那个成功的；如果所有promise都失败，就返回一个失败的promise
