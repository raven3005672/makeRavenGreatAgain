<!-- https://tech.meituan.com/2020/02/27/meituan-waimai-micro-frontends-practice.html -->

微前端拆分的方案，我们命名为：基于React技术栈的中心路由基座式微前端。在具体实现上，我们会分为动态化方案、路由配置信息设计、子工程接口设计、复用方案设计和流程方案设计等几个模块来逐一进行说明。

![img](https://p0.meituan.net/travelcube/266630d5a8afa0aeff73dc8c3ee40dc7224577.png)

## 动态化方案

路由的管理方案、Store层的方案、CSS的加载方案。

### 动态路由

特制路由管理模块 —— single-spa。

需要子工程实现特定的注册、挂载、卸载等接口来完成子工程和基座工程的动态对接。

特定的模块管理系统 —— systemjs。

react-router

![img](https://p0.meituan.net/travelcube/0629b94e3d2ac125e5eeec3ee4fd9ac9113580.png)

v3 —— 利用Route的getChildRoutes的API异步加载路由。
v4及以上 —— 不再以提前注册路由的集中式路由为设计理念，转变为路由即组件的思路。对于动态加载路由来说，就是动态加载组件，使得我们的动态加载更加容易实现，无需依赖任何API，只需写一个异步组件即可。

react-router v3基本思路

```js
export default () => {
  <Route
    path="/subapp"
    getChildRoutes={(location: any, cb: any) => {
      const { pathname } = location.loaction;
      // 取路径中识别子工程前缀的部分，例如 '/subapp/xxx/index' 其中xxx即路由唯一前缀
      const id = pathname.split('/')[2];
      const subappModule = (subAppMapInfo as any)[id];
      if (subappModule) {
        if (subappRoutes[id]) {
          // 如果已经加载过该子工程的模块，则不再加载，直接取缓存的routes
          cb(null, [subappRoutes[id]]);
          return;
        }
        // 如果能匹配上前缀则加载相应子工程模块
        currentPrefix = id;
        loadAsyncSubapp(subappModule.js).then(() => {
          // 加载子工程完成
          cb(null, [subappRoutes[id]]);
        }).catch(() => {
          // 如果加载失败$$
          console.log('loading failed');
        })
      } else {
        // 可以重定向到首页去
        goBackToIndex();
      }
    }}
  />
}
```

react-router v4基本思路

```js
export const AsyncComponent: React.FC<{ hotReload?: number; } & RouteComponentProps> = ({ location, hotReload } => {
  // 子工程资源是否加载完成
  const [asyncLoaded, setAsyncLoaded] = useState(false);
  // 子工程url配置信息是否加载完成
  const [subAppMapInfoLoaded, setSubAPpMapInfoLoaded] = useState(false);
  const [asyncComponent, setAsyncComponent] = useState(null);
  const { pathname } = location;
  // 区路径中表示子工程前缀的部分，例如 '/subapp/xxx/index' 其中xxx即路由唯一前缀
  const id = pathname.split('/')[2];
  useEffect(() => {
    // 如果没有子工程配置信息，则请求
    if (!subAPpMapInfoLoaded) {
      fetchSubappUrlPath(id).then((data) => {
        subAppMapInfo = data;
        setSubAppMapInfoLoaded(true);
      }).catch((url: any) => {
        // 失败处理
        goBackToIndex();
      });
      return;
    }
    const subappModule = (subAppMapInfo as any)[id];
    if (subappModule) {
      if (subappRoutes[id]) {
        // 如果已经加载过该子工程的模块，则不在加载，直接取缓存的routes
        setAsyncLoaded(true);
        setAsyncComponent(subappRoutes[id]);
        return;
      }
      // 如果能匹配上前缀则加载相应子工程模块
      // 如果请求成功，则触发JSONP钩子window.wmadSubapp
      currentPrefix = id;
      setAsyncLoaded(false);
      const jsUrl = subappModule.js;
      loadAsyncSubapp(jsUrl).then(() => {
        // 加载子工程完成
        setAsyncComponent(subappRoutes[id]);
        setAsyncLoaded(true);
      }).catch((urlList) => {
        // 如果加载失败
        setAsyncLoaded(false);
        console.log('loading failed...');
      });
    } else {
      // 可以重定向到首页去
      goBackToIndex();
    }
  }, [id, subAppMapInfoLoaded, hotReload]);
  return asyncLoaded ? asyncComponent : null;
});
```

### 动态Store

动态加载reducer，store.replaceReducer

```js
import store from 'common/store';
import { combineReducers } from 'redux-immutable';

store.asyncReducers = {};
export default function createReducer(reducers: any, asyncReducers: any, prefix: string) {
  store.asyncReducers[prefix] = asyncReducers;
  const allReducers = combineReducers({
    ...reducers,
    ...store.asyncReducers,
  });
  store.replaceReducer(allReducers);
}
```

动态加载saga，sagaMiddleware.run

```js
import { SagaMiddleware } from 'redux-saga';
import { all } from 'redux-saga/effects';

let sagaTask: any;
export default function createSaga(sagaMiddleware: SagaMiddleware<any>, asyncSaga: any) {
  if (sagaTask) {
    sagaTask.cancel();
  }
  sagaTask = sagaMiddleware.run(function* () {
    yield all(asyncSaga);
  });
  return sagaTask;
}
```

### 动态CSS

异步加载CSS文件通过style标签注入来完成，需要注意两个问题：

1. 加载子工程的JS入口文件和CSS文件可以同时发起请求，但是需要保证CSS文件加载完成后再进行JS入口文件的路由注册。可以通过先加载CSS再加载JS的策略来避免这个问题的发生。
2. 加载子工程的CSS不会和其他子工程冲突。可以利用PostCSS插件在编译子工程时，按照分配给子工程的唯一业务线标识，为每一组css规则生成了命名空间来解决这个问题，而子业务线开发者是没有感知的。

## 路由配置信息方案

业务线唯一识别为Key，相应的静态资源地址为Value。

![img](https://p0.meituan.net/travelcube/cc2d3afdc4c514b2a445f5670481bda899881.png)

JS资源拆分的问题可以在子工程中通过webpack的动态import进行路由懒加载，即子工程完全可以按照路由再次切分成chunks来减少js的包体积。

## 子路由接口方案

子工程需要暴露它要注册给基座工程的对象，来进行基座工程加载子工程的过程。在子工程入口文件中定义registerApp来传递注册的对象。

```js
import reducers from 'common/store/labor/reducer';
import sagas from 'common/store/labor/saga';
import routes from './routes/index';
function registerApp(dep: any = {}): any {
  return {
    routes, // 子工程路由组件
    reducers, // 子工程Redux的reducer
    sagas, // 子工程的Redux副作用处理saga
  };
}
export default registerApp;
```

子工程开发者只需要配置routes对象即可，没有学习成本。

```js
/**
 * 子工程路由注册说明
 * 如注册的路由如下：
 * path: 'index'
 * 路由前缀会被加上，路有前缀规则见变量urlPrefix
 * 在主工程的访问路径为：/subapp/${工程注册名称}/index
 */
const urePrefix = `/subapp/${microConfig.name}`;
const routes = [
  {
    path: 'index',
    component: IndexPage,
  }
];
const AppRoutes = () => {
  <Switch>
    {
      routes.map(item => (
        <Route
          key={item.path}
          exact
          path={`${urlPrefix}${item.path}`}
          component={item.component}
        />
      ))
    }
    <Redirect to="/" />
  </Switch>
}
export default AppRoutes;
```

## 复用方案

基座工程除了路由管理之外，还作为共享层共享全局的基建，例如框架基本库、业务组件等。这样做的目的是，子业务线间如果有相同的依赖，切换的时候就不会出现重复加载的问题。

把React相关库都以全局的方式导出，而子工程加载的时候就会以external的形式加载这些库，这样子工程的开发者不需要额外的第三方模块加载器，直接引用即可，和平时开发React应用一致。而和各个业务都相关的公用组件等，我们会放到wmadMicro的全局空间下进行管理。

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';
import * as Axios from 'axios';
import * as History from 'history';
import * as ReactRedux from 'react-redux';
import * as Immutable from 'immutable';
import * as ReduxSageEffects from 'redux-saga/effects';
import Echarts from 'echarts';
import ReactSlick from 'react-slick';
function registerGlobal(root: any, deps: any) {
  Object.keys(deps).forEach((key) => {
    root[key] = deps[key];
  });
}
registerGlobal(window, {
  // 在这里注册暴露给子工程的全局变量
  React,
  ReactDOM,
  ReactRouterDOM,
  Axios,
  History,
  ReactRedux,
  Immutable,
  ReduxSageEffects,
  Echarts,
  ReactSlick,
});
export default registerGlobal;
```

## 流程方案

确定开发方案、部署方案以及回滚方案

### 开发流程

第一种：提供一个基座工程的dev环境，子工程在本地启动后在dev环境进行开发，这种开发要求有一套基座工程的更新机制。

第二种：子工程开发者拉取基座工程到本地并启动本地开发环境，然后拉取子工程到本地，再启动子工程本地开发环境进行开发。

![img](https://p0.meituan.net/travelcube/726e1e83bca2153b6732e163b724c3af145796.png)

### 热更新

在子工程的module.hot中通过再次触发基座工程中的JSONP钩子来通知基座工程，再次触发renderApp达到子工程更新代码则页面热刷新的目的。

```js
// 在子工程入口文件
import routes from './routes/index';
function registerApp(dep: any = {}): any {
  return {
    routes,
  };
}
if ((module as any).hot) {
  (module as any).hot.accept('./routes/index', (): any => {
    window.wmadSubapp(registerApp, true); // 支持子工程热更新的信息传递
  });
}
export default registerApp;
```

### mock数据

略

### 部署方案

子工程部署只需要把子工程打包，并在上传CDN之后，把配置信息更新即可，因为配置信息中有子工程新的资源地址，这样就达到了发布上线的目的。

![img](https://p0.meituan.net/travelcube/94dc7a3cfea955f7452bee24012099eb86246.png)

### 回滚方案

略

### 监控方案

略

