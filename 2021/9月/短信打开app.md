web唤起app

URL Schema，universal link(ios)，app links(android)，URL Schema不能再短信中调起。

## URL Schema

```
[schema:][//authority][path][?query][#fragment]
```

常见的URL Schema:
- weixin://
- alipay://
- taobao://
- sinaweibo://

## universal link

ios9+

## app links

android 6.0+

## 注意

不能使用短链服务。访问短链接的时候，会重定向到我们的原始长链接，但是场景要求我们在域名根目录能访问到指定的配置文件。使用短链接服务的时候，短链根域名下并没有对应的配置文件，实现不了直接唤起app的功能。

