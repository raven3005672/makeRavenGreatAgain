强缓存
Expires
响应头，代表该资源的过期时间。是一个GMT 格式的标准时间。
Cache-Control
请求/响应头，缓存控制字段，精确控制缓存策略。

协商缓存
If-Modified-Since
请求头，资源最近修改时间，由浏览器告诉服务器。其实就是第一次访问服务端返回的Last-Modified的值。
Last-Modified
响应头，资源最近修改时间，由服务器告诉浏览器。
Etag
响应头，资源标识，由服务器告诉浏览器。
If-None-Match
请求头，缓存资源标识，由浏览器告诉服务器。其实就是第一次访问服务端返回的Etag的值。
