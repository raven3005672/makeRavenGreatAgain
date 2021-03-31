# 带边框的特殊三角形提示

## html

```html
<div class="test_triangle_border">
    <a href="#">三角形</a>
    <div class="popup">
        <span><em></em></span>纯CSS写带边框的三角形
    </div>
<div>
```

## CSS

```css
.test_triangle_border{
    width:200px; 
    margin:0 auto 20px;
    position:relative;
}
.test_triangle_border a{
    color:#333;
    font-weight:bold; 
    text-decoration:none;
}
.test_triangle_border .popup{
    width:100px;
    background:#fc0; 
    padding:10px 20px; 
    color:#333;  
    border-radius:4px;
    position:absolute; 
    top:30px; 
    left:30px;
    border:1px solid #333;
}
.test_triangle_border .popup span{
    display:block; 
    width:0; 
    height:0; 
    border-width:0 10px 10px; 
    border-style:solid; 
    border-color:transparent transparent #333; 
    position:absolute; 
    top:-10px; 
    left:50%;/* 三角形居中显示 */
    margin-left:-10px;/* 三角形居中显示 */
}
.test_triangle_border .popup em{
    display:block; 
    width:0; 
    height:0; 
    border-width:0 10px 10px; 
    border-style:solid; 
    border-color:transparent transparent #fc0; 
    position:absolute; 
    top:1px; 
    left:-10px;
}
```