# 微前端相关

## 传统web应用的利与弊

- 将平台内多个系统放置同一个代码仓库维护 ，采用 SPA（Single-page Application） 单页应用模式
- 将系统分为多个仓库维护，在首页聚合所有平台的入口，采用 MPA（Multi-page Application）多页应用模式

**若采用多个系统放置同一个项目内维护：**
- 优势
  - 统一的权限管控、统一的 Open API 开发能力
  - 更好的代码复用，基础库复用
  - 统一的运营管理能力
  - 不同系统可以很好的通信
  - SPA 应用特有优势：
    - 更好的性能
    - 具备局部更新，无缝的用户体验
    - 提前预加载用户下一页的内容
- 劣势
  - 代码权限管控问题
  - 项目构建时间长
  - 需求发布相互阻塞
  - 代码 commit 混乱、分支混乱
  - 技术体系要求统一
  - 无法同时灰度多条产品功能
  - 代码回滚相互影响
  - 错误监控无法细粒度拆分

**若采用拆分成多个仓库维护**
- 优势
  - 可以以项目维度拆分代码，解决权限管控问题
  - 仅构建本项目代码，构建速度快
  - 可以使用不同的技术体系
  - 不存在同一个仓库维护时的 commit 混乱和分支混乱等问题
  - 功能灰度互不影响
- 劣势
  - 用户在使用时体验割裂，会在不同平台间跳转，无法达到 SPA 应用带来的用户体验
  - 只能以页面维度拆分，无法拆分至区块部分，只能以业务为维度划分
  - 多系统同灰度策略困难
  - 公共包基础库重复加载
  - 不同系统间不可以直接通信
  - 公共部分只能每个系统独立实现，同一运维通知困难
  - 产品权限无法进行统一收敛

## 微前端解决方案

- 子系统间的开发、发布从空间上完成隔离
- 子系统可以使用不同的技术体系
- 子系统间可以完成基础库的代码复用
- 子系统间可以快速完成通信
- 子系统间需求迭代互不阻塞
- 子应用可以增量升级
- 子系统可以走向同一个灰度版本控制
- 提供集中子系统权限管控
- 用户使用体验整个系统是一个单一的产品，而不是彼此的孤岛
- 项目的监控可以细化到到子系统

**为什么不用iframe**
谈到微前端绕不开的话题就是为什么不适用 iframe 作为承载微前端子应用的容器，其实从浏览器原生的方案来说，iframe 不从体验角度上来看几乎是最可靠的微前端方案了，主应用通过iframe 来加载子应用，iframe 自带的样式、环境隔离机制使得它具备天然的沙盒机制，但也是由于它的隔离性导致其并不适合作为加载子应用的加载器，iframe 的特性不仅会导致用户体验的下降，也会在研发在日常工作中造成较多困扰，以下总结了 iframe 作为子应用的一些劣势：
- 使用Iframe 会大幅增加内存和计算资源，因为 iframe 内所承载的页面需要一个全新并且完整的文档环境
- Iframe 与上层应用并非同一个文档上下文导致
  - 事件冒泡不穿透到主文档树上，焦点在子应用时，事件无法传递上一个文档流
    - 主应用劫持快捷键操作
    - 事件无法冒泡顶层，针对整个应用统一处理时效
  - 跳转路径无法与上层文档同步，刷新丢失路由状态
  - Iframe 内元素会被限制在文档树中，视窗宽高限制问题
  - Iframe 登录态无法共享，子应用需要重新登录
  - Iframe 在禁用三方 cookie 时，iframe 平台服务不可用
  - Iframe 应用加载失败，内容发生错误主应用无法感知
  - 难以计算出 iframe 作为页面一部分时的性能情况
- 无法预加载缓存 iframe 内容
- 无法共享基础库进一步减少包体积
- 事件通信繁琐且限制多

从设计层面采取的是基座+子应用分治的概念，部署平台负责进行服务发现和服务注册，将注册的应用列表信息下发至基座，通过基座来动态控制子系统的渲染和销毁，并提供集中式的模式来完成应用间的通信和应用的公共依赖管理。

**四个核心能力**
- 加载器（Loader）
  - 负责注册平台侧提供的应用列表
  - 负责加载和解析子应用入口资源
    - HTML 入口类型，拆解 HTML Dom、Script、Style
    - JS 入口类型，提供基础 Dom 容器
  - 预加载能力
  - 解析子应用导出内容
- 沙箱隔离（Sandbox）
  - 提供代码执行能力，收集执行代码时存在的副作用
  - 提供销毁收集副作用的能力
  - 支持沙箱多实例，收集不同实例的副作用
- 路由托管（Router）
  - 解决不同应用间的路由不同步问题
  - 提供路由劫持能力，在主应用上管控子应用路由
  - 提供路由驱动能力来拼装完整的平台的能力
- 子应用通信（Store）
  - 建立通信桥梁
  - 提供共享机制

**应用生命周期**
- 渲染阶段
  - 主应用通过路由驱动或手动挂载的方式触发子应用渲染
  - 开始加载应用的资源内容，并初始化子应用的沙箱运行时环境
  - 判断入口类型
    - 若入口类型为 HTML 类型，将开始解析和拆解子应用资源
    - 若入口类型为 JS，创建子应用的挂点 DOM
  - 将子应用存在”副作用“（对当前页面可能产生影响的内容）交由沙箱处理
  - 开始渲染子应用的 DOM 树
  - 触发子应用的渲染 Hook
- 销毁阶段
  - 若路由变化离开子应用的激活范围或主动触发销毁函数，触发应用的销毁
  - 清除应用在渲染时和运行时产生的副作用
  - 移除子应用的 DOM 元素

**加载器的设计**
- 异步加载组件资源
- 可以预加载资源
- 可以缓存组件资源
- 缓存组件实例

**沙箱的设计**
在 Webpack5 中提供了一个重要的功能就是 Module Federation，随着 Webpack 5 推出 Module Federation ，与 Webpack 4 发生变化的一个重要配置就是 JsonpFunction 属性变为了 chunkLoadingGlobal，并且由原来的默认值 webpackJsonp 变成了默认使用 output.library 名称或者上下文中的 package.json 的 包名称(package name)作为唯一值。

为什么会发生这个转变呢，如果了解过 Webpack 构建产物的一定会知道 Webpack 通过全局变量存储了分 chunk 后的产物，用于解决分包 chunk 的加载问题。由于 Webpack 5 引入 Module Federation 页面中可能会同时存在两个以上的 Webpack 构建产物，如果还是通过是通过同一个变量存储要加载的 chunk ，必然会造成产物之间的互相影响。

为了保证应用能够稳定的运行且互不影响，需要提供安全的运行环境，能够有效地隔离、收集、清除应用在运行期间所产生的副作用，那应用运行期间主要会产生哪些副作用呢，可以将其分为以下几类：全局变量、全局事件、定时器、网络请求、localStorage、Style 样式、DOM 元素。

快照沙箱
核心设计思想简述：
- 针对每一种副作用提供一个 Patch 类，这个类需要提供 save 和 load 两个方法
- Save 对应着该副作用的环境快照存储，Load 对应着销毁该副作用的销毁恢复环境
- 并且针对每一种 Patch 还可以存储其在运行期间发生的变化，在优化场景时并不用所有代码，仅恢复执行环境即可

VM 沙箱
针对副作用的类型：全局变量、全局事件、定时器、网络请求、localStorage、Style 样式、DOM 元素，分别提供了全新的执行上下文：
- Window
  - 用于隔离全局环境
- document
  - 用于捕获动态创建的 DOM 节点、Style、Script
    - 收集 DOM 副作用
    - 收集 Style 副作用，进行处理
    - 收集 Script，继续放置沙箱处理
- timeout、interval
  - 处理定时器
- localstorage
  - 隔离 localStorage
- listener
  - 收集全局事件

新的执行上下文有两个来源，
- 来源于当前环境
- 来源于 Iframe 的执行环境

由于 Iframe 创建后需要需要较多的内存资源和计算资源，而微前端中的 VM 沙箱并不需要一个完全的执行上下文，所以可以基于当前环境。

**路由系统的设计**
正常路由情况
假设站点地址为：http://garfish.bytedance.net
- 主应用 history 模式、子应用 history 模式
  - 主应用（basename: /example）
    - 主应用所有路由基于：http://garfish.bytedance.net/example
    - 例如跳转到：/appA，http://garfish.bytedance.net/example/appA/
  - 子应用（basename: /example/appA）：
    - 子应用所有路由基于：http://garfish.bytedance.net/example/appA
    - 跳转到子应用的 /detail 页，http://garfish.bytedance.net/example/appA/detail
  - 特点：
    - 当主子应用分别为 history 模式时，子应用的路由基于主应用基础路由并带上自己的业务路由
    - 路由同步到主应用路由上，通过 子应用 scope 命名空间隔离（子应用 A，提供 appA 的 scope）主应用和其他应用的路由冲突，并将子应用
    - 路径符合用户和开发者认知和理解
    - 支持嵌套层级使用，并继续通过 scope 的命名空间保证路由可读
- 主应用 history 模式、子应用 hash 模式
  - 主应用（basename: /example）
    - 主应用所有路由基于：http://garfish.bytedance.net/example
    - 例如跳转到：/appA，http://garfish.bytedance.net/example/appA/
  - 子应用（basename: /example/appA）：
    - 子应用所有路由基于：http://garfish.bytedance.net/example/appA
    - 从主应用：http://garfish.bytedance.net/example/appA，跳转到子应用的 /detail 页，http://garfish.bytedance.net/example/appA#/detail
  - 特点：
    - 在一定程度上具备主子应用都为 history 模式的优势，不支持嵌套层级使用
    - 目前多数框架都不支持以 hash 值作为 basename
    - 可读性尚可
  
异常路由情况
- 主应用 hash 模式、子应用 history 模式
  - 主应用（basename: /example）
    - 主应用所有路由基于：http://garfish.bytedance.net/example
    - 例如跳转到：/detail，http://garfish.bytedance.net/example#/appA
  - 子应用（basename: /example/appA）：
    - 子应用所有路由基于：http://garfish.bytedance.net/example#/appA
    - 跳转到子应用的 /detail 页，http://garfish.bytedance.net/example/detail#/appA
  - 特点：
    - 「路由混乱」，不符合用户和开发者直觉
    - 目前多数框架都不支持以 hash 值作为 basename
- 主应用 hash 模式、子应用 hash 模式
  - 主应用（basename: /example）
    - 主应用所有路由基于：http://garfish.bytedance.net/example
    - 例如跳转到：/detail，http://garfish.bytedance.net/example#/appA
  - 子应用（basename: /example/appA）：
    - 子应用所有路由基于：http://garfish.bytedance.net/example#/appA
    - 跳转到子应用的 /detail 页，http://garfish.bytedance.net/example#/detail
  - 特点：
    - 「路由混乱」，不符合用户和开发者直觉
    - 目前多数框架都不支持以 hash 值作为 basename
    - 可能与主应用或其他子应用发生路由冲突

## 微前端的优点

- 适用于大规模Web应用的开发
- 更快的开发速度
- 支持迭代可开发和增强升级
- 拆解后的部分见底了开发者的理解成本
- 同时具备UX和DX的开发模式

## 微前端的缺点

- 复杂度从代码转向基础设施
- 整个应用的稳定性和安全性变得更加不可控
- 具备一定的学习和了解成本
- 需要建立全面的微前端周边设施，才能充分发挥其架构的优势
  - 调试工具
  - 监控系统
  - 上层Web框架
  - 部署平台
