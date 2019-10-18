# 时间绑定

## 在DOM中绑定

```
<button onclick="alert(123)" type="button"></button>
<button onclick="myClick()"></button>
<script>
    function myClick() {
        // ...
    }
</script>
```

## Element.onXxxx = function() {}

```
element.onclick = function() {
    // ...
}
```

## EventListener

```
// IE8以上
element.addEventListener(type, handle, useCapture);
// useCapture是是否捕获事件流

// IE8及其以下
element.attachEvent(type, handle);

```


