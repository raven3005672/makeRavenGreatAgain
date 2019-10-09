// link点击事件handleClick部分源码
if (_this.props.onClick) {
    _this.props.onClick(event);
}
if (!event.defaultPrevented &&  // onClick prevented default
event.button === 0 &&           // ignore everything but left clicks
!_this.props.target &&          // let browser handle "target=_blank" etc.
!isModifiedEvent(event)         // ignore clicks with modifier keys
) {
    event.preventDefault();
    var history = _this.context.router.history;
    var _this$props = _this.props,
        replace = _this$props.replace,
        to = _this$props.to;
    if (replace) {
        history.replace(to);
    } else {
        history.push(to);
    }
}

// Link做了3件事情
// 1.有onClick那就执行onClick
// 2.click的时候阻止a标签默认事件（这样子点击<a href="/asd">123</a>就不会跳转和刷新页面）
// 3.再取得跳转href（即是to），用history（前端路由两种方式之一，history&hash）跳转，此时只是链接变了，并没有刷新页面


// 禁掉 a 标签的默认事件，可以在点击事件中执行 event.preventDefault();
// 禁掉默认事件的 a 标签 可以使用 history.pushState() 来改变页面 url，这个方法还会触发页面的 hashchange 事件，Router 内部通过捕获监听这个事件来处理对应的跳转逻辑。