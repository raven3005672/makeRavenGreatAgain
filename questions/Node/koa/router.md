# koa-router

<!-- https://zhuanlan.zhihu.com/p/91480087 -->

* koa-router是如何实现的
* 路由规则如何匹配的
* koa-router有没有什么问题

## router

```js
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();
router.get('/test', (ctx, next) => {
    console.log('test');
    ctx.response.status = 200;
    ctx.body = 'text';
});
router.get('/', (ctx, next) => {
    console.log('home');
    ctx.response.status = 200;
    ctx.body = 'home';
});
app
    .use(async(ctx, next) => {
        console.log('中间件触发=》进入');
        await next();
        console.log('中间件触发=》退出');
    })
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(1111);
```

先获取了Router类，并实例化一个router，然后使用router提供的api定义我们Node服务的路由规则，最终使用koa的use，将router组件放进koa的中间件中。

### new Router到底干了什么？

```js
function Router(opts) {
    if (!(this instanceof Router)) {
        return new Router(opts);
    }
    this.opts = opts || {};
    this.methods = this.opts.methods || [
        'HEAD',
        'OPTIONS',
        'GET',
        'PUT',
        'PATCH',
        'POST',
        'DELETE'
    ];
    this.params = {};
    this.stack = [];
}
```

Router的class非常简单，只是对一些值的赋值和初始化。

在Router的原型上有以下一些api

1. all
2. allowedMethods
3. match
4. param
5. prefix
6. redirect
7. register
8. route
9. url
10. use
11. del
12. routes

在文档中出现的一些get、post等等的一些api，并不在原型中，原因是在我们实例化会执行一下代码：

```js
methods.forEach(function(method) {
    Router.prototype[method] = function(name, path, middleware) {
        var middleware;
        if (typeof path === 'string' || path instanceof RegExp) {
            middleware = Array.prototype.slice.call(arguments, 2);
        } else {
            middleware = Arrya.prototype.slice.call(arguments, 1);
            path = name;
            name = null;
        }
        this.register(path, [method], middleware, {
            name: name
        });
        return this;
    }
})
```

这里methods实际上是http.METHODS返回的数组。这里实际上就是把当前http支持的请求方式都复制到Router的原型上，从而实现了router.get这样的调用方式。

### 如果添加路由规则

添加路由规则我们一般是使用router.get或者post等等的api，那么具体是做什么呢，先看看源码

```js
Router.prototype[method] = function(name, path, middleware) {
    var middleware;
    // 当判断我们是否有对路由进行命名
    if (typeof path === 'string' || path instanceof RegExp) {
        middleware = Array.prototype.slice.call(arguments, 2);
    } else {
        // 当我们没有对路由进行命名，那么将第一个参数作为路径使用
        middleware = Arrya.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
    }
    // 注册路由到Router中
    this.register(path, [method], middleware, {
        name: name
    });
    return this;
}
```

将我们路由规则中的参数组装，并调用Router的register函数注册进router实例中

```js
Router.prototype.reigster = function(path, methods, middleware, opts) {
    opts = opts || {};
    var router = this;
    var stack = this.stack;
    // 如果当前的path是一个数组的形式传入，将循环注册（同一个this中）
    if (Array.isArray(path)) {
        path.forEach(function(p) {
            router.register.call(router, p, methods, middleware, opts);
        });
        return this;
    }
    // 创建一个路由实例
    var route = new Layer(path, methods, middleware, {
        end: opts.end === false ? opts.end : true,
        name: opts.name,
        sensitivie: opts.sensitive || this.opts.sensitive || false,
        strict: opts.strict || this.opts.strict || false,
        prefix: opts.prefix || this.opts.prefix || "",
        ignoreCaptures: opts.ignoreCaptures
    });
    if (this.opts.prefix) {
        route.setPrefix(this.opts.prefix);
    }
    // add parameter middleware
    Object.keys(this.params).forEach(function(param) {
        route.param(param, this.params[param]);
    }, this);
    // 将路由实例推入router的stack中
    stack.push(route);
    return route;
}
```

Layer实现

```js
function Layer(path, methods, middleware, opts) {
    this.opts = opts || {};
    this.name = this.opts.name || null;
    this.methods = [];
    this.paramNames = [];
    this.stack = Array.isArray(middleware) ? middleware : [middleware]; // 记录我们传入的回调函数是否是一个数组
    methods.forEach(function(method) {
        var l = this.methods.push(method.toUpperCase());
        if (this.methods[l-1] === 'GET') {
            // 当判断有GET请求，将在前面放入一个HEAD
            this.methods.unshift('HEAD');
        }
    }, this);
    // 必须确保传入的回调一定是一个函数
    this.stack.forEach(function(fn) {
        var type = (typeof fn);
        if (type !== 'function') {
            throw new Error(
                methods.toString() + ' `' + (this.opts.name || path) + '`: `middleware' +
                'must be a function, not `' + type + '`'
            );
        }
    }, this);
    this.path = path;
    this.regexp = pathToRegExp(path, this.paramNames, this.opts);   // 将传入的路径转换为正则
    debug('defined route %s %s', this.methods, this.opts.prefix + this.path);
}
```

当声明多个路由规则的时候，stack将会不断增加路由实例。

```js
stack: Array(2) [Layer, Layer]
```

在这个时候其实我们一直都是在为router这个中间件添加路由规则，直到我们使用koa的use的方式将router注册进koa，路由的规则才能生效。

```js
use(router.routes())
```

那么router.routes()具体做了什么，是如何判断我们的请求进入那个路由规则中的呢？在koa的中间中使用use，我们必须使用一个函数，所以router.routes最终返回一个dispatch函数给koa中间件去执行。

```js
Router.prototype.routes = Router.prototype.middleware = function() {
    var router = this;
    var dispatch = function dispatch(ctx, next) {
        debug('%s %s', ctx.method, ctx.path);
        var path = router.opts.routerPath || ctx.routerPath || ctx.path;
        // 执行router实例中的match函数
        var matched = router.match(path, ctx.method);
        var layerChain, layer, i;

        if (ctx.matched) {
            ctx.matched.push.apply(ctx.matched, matched.path);
        } else {
            ctx.matched = matched.path;
        }
        ctx.router = router;
        // 如果matched的route为false，即没有method
        if (!mathced.route) return next();
        var matchedLayers = matched.pathAndMethod
        // 赋值到ctx中，最先命中的路由规则
        var mostSpecificLayer = matchedLayers[matchedLayers.length - 1];
        ctx._matchedRoute = mostSpecificLayer.path;
        if (mostSpecificLayer.name) {
            ctx._matchedRouteName = mostSpecificLayer.name;
        }
        // 实际上这里就是实现一个内部的中间件数组
        layerChain = matchedLayers.reduce(function(memo, layer) {
            // 暂时不知道作用，阅读到后面或许知道
            memo.push(function(ctx, next) {
                ctx.captures = layer.captures(path, ctx.captures);
                ctx.params = layer.params(path, ctx.captures, ctx.params);
                ctx.routerName = layer.name;
                return next();
            });
            return memo.concat(layer.stack);
        }, []);
        // 调用koa-compose
        // 内部实现一次洋葱模型并主动触发
        return compose(layerChain)(ctx, next);
    }
    dispatch.router = this;
    return dispatch;
}
```

![img](https://pic4.zhimg.com/80/v2-41e3ee1c42abf1771c8a7b6c086fee6f_hd.jpg)

到这里，最最最基本的配置路由及实现方式就结束了。实际上koa的router也是作为一个中间件，但是我们每一次注册的路由，最终都会在koa-router这个中间件中自己内部循环触发，相当于一个洋葱包着另一个洋葱。

同时也通过代码发现一些问题，因为要确定当前的路由到底命中哪个路由规则，所以需要在接收到请求的时候对所有注册的路由进行循环判断到底哪些命中了，然后内部再合成一个洋葱模型的中间件。当我们比较小型的应用可能路由只有十来二十个的时候，其实一点问题都没有，但是如果当我们路由规则相当多，到达一定量级，例如1万个路由规则，那么这个时候在接收到请求的时候，循环匹配命中的路由将会带来一定的性能损耗。

### allowedMethods

在官方文档中，建议我们要配合allowedMethods这个中间件使用，那么allowedMethods中间件到底是干什么的，为什么要配合使用呢？

```js
Router.prototype.allowedMethods = function(options) {
    options = options || {};
    var implemented = this.methods;
    return function allowedMethods(ctx, next) {
        return next().then(function() {
            var allowed = {};
            // 当没有status或者status == 404的时候，allowedMethods才开始工作
            if (!ctx.status || ctx.status == 404) {
                // 获取当前路由的类型
                ctx.matched.forEach(function(route) {
                    route.methods.forEach(function(method) {
                        allowed[method] = method;
                    })
                });
                var allowedArr = Object.keys(allowed);
                // 如果当前请求的类型不是支持的类型，那么将根据配置选择是返回501还是报错
                if (!~implemented.indexOf(ctx.method)) {
                    if (options.throw) {
                        var notImplementedThrowable;
                        if (typeof options.notImplemented === 'function') {
                            notImplementedThrowable = options.notImplemented();
                        } else {
                            notImplementedThrowable = new HttpError.NotImplemented();
                        }
                        throw notImplementedThrowable;
                    } else {
                        ctx.status = 501;
                        ctx.set('Allow', allowedArr.join(', '));
                    }
                } else if (allowedArr.length) {
                    // 如果是OPTIONS请求，那么将返回当前命中路由所支持的请求类型
                    if (options.throw) {
                        var notAllowedThrowable;
                        if (typeof options.methodNotAllowed === 'function') {
                            notAllowedThrowable = options.methodNotAllowed();
                        } else {
                            notAllowedThrowable = new HttpError.MethodNotAllowed();
                        }
                        throw notAllowedThrowable;
                    } else {
                        ctx.status = 405;
                        ctx.set('Allow', allowedArr.join(', '));
                    }
                }
            }
        })
    }
}
```

allowedMethods必须紧跟router中间件。在中间件执行完后会对请求做一些兜底操作。

### router的其他api

#### all

```js
Router.prototype.all = function(name, path, middleware) {
    var middleware;
    if (typeof path === 'string') {
        middleware = Array.prototype.slice.call(arguments, 2);
    } else {
        middleware = Arrya.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
    }
    // methods就是所有能支持的请求类型，因为内部会经过循环比对是否命中路径规则，而且还命中请求类型
    // 所以尽可能少去使用all，而是明确指明使用的请求类型
    this.register(path, methods, middleware, {
        name: name
    });
    return this;
}
```

#### use

```js
router.use(async (ctx, next) => {
    ctx.session = '123123';
    console.log('session -> in');
    await next();
    console.log('session -> out');
});
router.get('/test', (ctx, next) => {
    console.log('test');
    ctx.body = 'text';
});
router.get('/'. async (ctx, next) => {
    console.log('home');
    ctx.body = 'home';
});
```

在use的源码中当使用use的时候没有指定路由规则，那么将是所有路由都可以命中，实际上当使用use的时候，也会调用router.register注册中间件，但是这个时候注册时所传入的path将会是这样（.*），可以命中所有路由，从而每次请求的match阶段，都会命中这个中间件。

官方还有另一种写法，可以指定路由触发，和配置多个路由触发。

```js
router.use('/users', userAuth());
router.use(['/users', '/admin'], userAuth());
```

源码判断到如果第一位是一个字符串，就直接注册时传入这个字符串当做这个中间件的path，从而来命中，如果传入的是数组，那么就会循环执行use来将数组中的path逐个注册。

#### prefix

为你的路由设置前缀

```js
router.prefix('/things/:thing_id');
```

无论prefix是在注册路由前还是注册路由后，最终都会为每一个路由规则的path修改为prefix+path，从而改变router规则中的path的正则表达式。

#### redirect

重定向

```js
Router.prototype.redirect = function(source, destination, code) {
    // 如果首字不是 / 将调用url函数创建一个合法的url
    if (source[0] !== '/') {
        source = this.url(source);
    }
    if (destination[0] !== '/') {
        destination = this.url(destination);
    }
    return this.all(source, ctx => {
        ctx.redirect(destination);  // 调用ctx中的redirect函数进行重定向
        ctx.status = code || 301;
    });
}
```

#### url

根据传入的具体路由规则获取对应的path

#### param

```js
// 用例
router.param('user', (id, ctx, next) => {
    ctx.user = users[id];
    if (!ctx.user) return ctx.status = 404;
    return next();
})
    .get('/users', ctx => {
        ctx.body = ctx.user;
    })
    .get('/users/:user', ctx => {
        ctx.body = ctx.user;
    })
    .get('/users/:user/friends', ctx => {
        return ctx.user.getFriends().then(function(friends) {
            ctx.body = frineds;
        });
    });

// 源码
Router.prototype.param = function(param, middleware) {
    this.params[param] = middleware;
    this.stack.forEach(function(route) {
        route.param(param, middleware);
    });
    return this;
}
```

在我们调用param的时候，实际上会添加在router实例上的params数组中。当我们添加param的时候，如果之前已经注册了路由，那么stack将会存在之前我们注册的路由，那么将循环调用stack中每个路由的param函数，来进行匹配当前加入的这个param是否命中。

在调用param之后，我们还需要注册路由的时候，那么将会在register的时候，循环当前router实例的params数组，循环调用params数组的来调用route的param方法来判断是否命中。

```js
Object.keys(this.params).forEach(function(param) {
    route.param(param, this.params[param]);
}, this);

// param的源码
Layer.prototype.param = function(param, fn) {
    var stack = this.stack;
    var params = this.paramNames;
    var middleware = function(ctx, next) {
        return fn.call(this, ctx.params[param], ctx, next);
    };
    middleware.param = param;
    var names = params.map(function(p) {
        return p.name;
    });
    var x = names.indexOf(param);
    if (x > -1) {
        stack.some(function(fn, i) {
            if (!fn.param || namse.indexOf(fn.name) > x) {
                stack.splice(i, 0, middleware);
                return true;
            }
        })
    }
    return this;
}
```

主要是判断当前的Layer实例中的paramNames参数是否有数据，该数据是通过在实例化一个Layer对象的时候通过pathToRegExp函数，对路径进行正则匹配，找到当前路径的带有":"标识的参数值，然后存放在paramNames
当中。回到param函数中，就是循环paramNames来将满足条件的param的回调函数放到当前路由stack的数组中，并且从头开始放入。从而实现匹配对应路由参数的匹配关系。

## 总结

* koa的路由为了要满足洋葱模型的是理念，避免不了不少循环
* 当使用koa的服务有大量的中间件，以及大量的路由时候，会产生大量的循环，从而影响启动速度和路由响应速度
* 当node服务逐渐庞大，路由和中间件使用的越来越多的时候，要考虑将服务拆分或其他方案。
