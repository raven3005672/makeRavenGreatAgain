// 绝对长度单位
// px像素

// 相对长度单位
// em
// em大小是动态的，当定义font-size属性时，1em等于元素的父元素的字体大小，如果你的网页中任何地方都没有设置文字大小的话，那它将等于浏览器默认文字大小，通常16px。
// 所以通常1em=16px，2em=32px。如果你设置了body元素的字体大小为20px，那1em=20px，2em=40px。
<body>
    <div class="parent">
        <div class="child"></div>
    </div>
</body>
body {
    font-size: 62.5%;   /* 1em = 10px */
}
.parent {
    font-size: 2em;     /* 2em = 20px */
}
.child {
    font-size: 2em;     /* 2em = 40px 相对于.parent元素 */
}
// 使用时需要注意1em指的是父元素的字体大小

// rem（root em）
// rem是css3新增的单位，1rem等于html根元素的字体大小。通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应
<html style="font-size: 10px;">
    <body>
        <div class="parent">
            <div class="child"></div>
        </div>
    </body>
</html>
.parent {
    font-size: 2rem;    /* 2rem = 20px */
}
.child {
    font-size: 2rem;    /* 2rem = 20px */
}

