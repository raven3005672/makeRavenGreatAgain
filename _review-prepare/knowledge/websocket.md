new WebSocket(url)

CONNECTING -> 0
OPEN -> 1
CLOSING -> 2
CLOSED -> 3

WebSocket.onopen -> 连接成功，开始通讯
WebSocket.onmessage -> 客户端接受服务端发送的消息
WebSocket.onclose -> 连接关闭后的回调函数
WebSocket.onerror -> 连接失败后的回调函数
WebSocket.readyState -> 当前的连接状态
WebSocket.close -> 关闭当前连接
WebSocket.send -> 客户端向服务端发送消息

## 什么是WebSocket

是一种协议，用于客户端与服务端相互通讯。协议的标识符为 ws，加密则为 wss。

wss://api.chat.deeruby.com

## 为什么使用WebSocket

在传统的 HTTP 协议中，通讯只能由客户端发起，服务端无法主动向客户端推送消息，需通过轮询方式让客户端自行获取，效率极低。

## Websocket连接是如何创建的

WebSocket 并不是全新协议，而是利用 HTTP 协议来建立连接，故此连接需从浏览器发起，格式如下：

```
GET wss://api.chat.deeruby.com/ HTTP/1.1
Host: api.chat.deeruby.com
Connection: Upgrade
Upgrade: websocket
Origin: https://chat.deeruby.com
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: dsRxU8oSxU2Jru9hOgf4dg==
```

- 请求头Upgrade: websocket和Connection: Upgrade表示这个连接将要被转换为 WebSocket 连接。
- Sec-WebSocket-Version指定了 WebSocket 的协议版本，如果服务端不支持该版本，需要返回一个Sec-WebSocket-Version header，里面包含服务端支持的版本号。
- Sec-WebSocket-Key与服务端Sec-WebSocket-Accept配套，用于标识连接

随后，服务器若接受该请求，则做如下反应：

```
HTTP/1.1 101 Switching Protocols 
Connection: upgrade 
Upgrade: websocket 
Sec-WebSocket-Accept: aAO8QyaRJEYUX2yG+pTEwRQK04w=
```

- 响应码 101 表示本次连接的 HTTP 协议将被更改，更改为 Upgrade: websocket 指定的 WebSocket 协议。
- Sec-WebSocket-Accep 是将 Sec-WebSocket-Key 跟 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 拼接，通过 SHA1 计算并转换为 base64 字符串。

## 什么是SSE

SSE 全称：Server-Sent Events
SSE 使用 HTTP协议，而 HTTP 协议无法由服务器主动推送消息，但有一种变通方式，即服务端向客户端声明，接下来发送的为流信息。其为一个连续发送的数据流，而不是一个一次性的数据包，故客户端不会关闭连接，而是一直等服务器发送新的数据流。SSE 就是通过这种机制，使用流信息向浏览器推送消息。

## 什么场景选用SSE

只需要服务器给客户端发送消息的场景时，SSE可胜任。
