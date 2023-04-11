```css
// PX 转 rem 
@function px2Rem($px, $base-font-size: 19.2px) {
  @if (unitless($px)) { 
    //有无单位 
    @return ($px / 19.2) * 1rem; 
  } @else if (unit($px) == em) { 
    @return $px; 
  } 
  @return ($px / $base-font-size) * 1rem; 
}

// 使用
#test{
  width:px2Rem(273px) 
}
//输出
#test{
  width:14.21875rem;
}
```