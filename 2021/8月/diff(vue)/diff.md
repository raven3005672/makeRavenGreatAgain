
<!-- ## 虚拟DOM

- 什么是虚拟dom
- 为什么要使用虚拟dom
- 虚拟dom库

## DIFF算法

- snabbDom源码
  - init函数
  - h函数
  - patch函数
  - patchVnode函数
  - updateChildren函数 -->
  
## 为什么要使用虚拟dom？

- MVVM框架解决视图和状态同步问题。
- 模板引擎可以简化视图操作，没办法跟踪状态。
- 虚拟DOM跟踪状态变化。
  - 虚拟DOM可以维护程序的状态，跟踪上一次的状态。
  - 通过比较前后两次状态差异更新真实DOM。
- 跨平台使用
  - 浏览器平台渲染DOM
  - 服务端渲染SSR
  - 原生应用
  - 小程序等
- 真实DOM的属性很多，创建DOM节点开销很大
- 虚拟DOM只是普通JavaScript对象，描述属性并不需要很多，创建开销很小
- 复杂视图情况下提升渲染性能（操作dom性能消耗大，减少操作dom的范围可以提升性能）

使用虚拟DOM比直接操作真实DOM不一定更快。

复杂视图的情况下提升渲染性能。

## 虚拟dom库

- Snabbdom（vue2.x用的）
- virtual-dom

## Diff算法

## snabbdom的核心

- **init()**设置模块，创建**patch()**函数
- 使用**h()**函数创建JS对象(Vnode)描述**真实DOM**
- **patch()**比较**新旧两个Vnode**
- 把变化的内容更新到**真实DOM树**

### init函数

init函数时设置模块，然后创建patch()函数。
- 导入模块
- 注册模块
- 使用h()函数的第二个参数传入模块中使用的数据(对象)

当init使用了导入的模块就能够在h函数中用这些模块提供的api去创建**虚拟DOM(Vnode)对象**，在上文中就使用了**样式模块**以及**事件模块**让创建的这个虚拟DOM具备样式属性以及事件属性，最终通过**patch函数**对比**两个虚拟dom**（会先把app转换成虚拟dom），更新视图。

### h函数

有些地方也会用**createElement**来命名，他们是一样的东西，都是创建**虚拟DOM**的，先生成一个**vnode**函数，然后**vnode**函数再生成一个**Vnode**对象（虚拟DOM对象）

### patch函数（核心）

- patch(oldVnode, newVnode)
- 把新节点中变化的内容渲染到真实DOM，最后返回新节点作为下一次处理的旧节点
- 对比新旧Vnode是否相同节点(节点的key和sel相同)
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的**Vnode**是否有**text**，如果有并且和**oldVnode**的**text**不同，直接更新文本内容**patchVnode**
- 如果新的Vnode有children，判断子节点是否有变化**updateChildren**

```js
return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
  let i: number, elm: Node, parent: Node;
  const insertedVnodeQueue: VNodeQueue = [];
  // cbs.pre就是所有模块的pre钩子函数集合
  for (i = 0; cbs.pre.length; ++i) cbs.pre[i]();
  // isVnode函数时判断oldVnode是否是一个虚拟DOM对象
  if (!isVnode(oldVnode)) {
    // 若不是即把Element转换成一个虚拟DOM对象
    oldVnode = emptyNodeAt(oldVnode);
  }
  // sameVnode函数用于判断两个虚拟DOM是否是相同的
  if (sameVnode(oldVnode, vnode)) {
    // 相同则运行patchVnode对比两个节点
    patchVnode(oldVnode, vnode, insertedVnodeQueue);
  } else {
    elm = oldVnode.elm!;
    // parentNode就是获取父元素
    parent = api.parentNode(elm) as Node;
    // createElm是用于创建一个dom元素插入到vnode中(新的虚拟DOM)
    createElm(vnode, insertedVnodeQueue)
    if (parent !== null) {
      // 把dom元素插入到父元素中，并且把旧的dom删除
      api.insertBefore(parent, vnode.elm!, api.nextSibling(elm)); // 把新创建的元素放在就的dom后面
      removeVnodes(parent, [oldVnode], 0, 0)
    }
  }
  for (i = 0; i < insertedVnodeQueue.length; ++i) {
    insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i]);
  }
  for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
  return vnode;
}

function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
```

### patchVnode

- 第一阶段触发**prepatch**函数以及**update**函数(都会触发prepatch函数，两者不完全相同才会触发update函数)
- 第二阶段，真正对比新旧vnode差异的地方
- 第三阶段，触发postpatch函数更新节点

```js
function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VnodeQueue) {
  const hook = node.data?.hook;
  hook?.prepatch?.(oldVnode, vnode);
  const elm = vnode.elm = oldVnode.elm!;
  const oldCh = oldVnode.children as VNode[];
  const ch = vnode.children as VNode[];
  if (oldVnode === vnode) return;
  if (vnode.data !== undefined) {
    for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    vnode.data.hook?.update?.(oldVnode, vnode);
  }
  if (isUndef(vnode.text)) {  // 新节点的text属性是undefined
    if (isDef(oldCh) && isDef(ch)) { // 当新旧节点都存在子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue); // 并且他们的子节点不相同，执行updateChildren函数
    } else if (isDef(ch)) { // 只有新节点有子节点
      // 当旧节点有text属性就会把''赋予给真实dom的text属性
      if (isDef(oldVnode.text)) api.setTextContent(elm, '');
      // 并且把新节点的所有子节点插入到真实dom中
      addVnodes(elm, null, ch, 0, oldCh.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) { // 清除真实dom的所有子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) { // 把''赋予给真实dom的text属性
      api.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {  // 若旧节点的text与新节点的text不相同
    if (isDef(oldCh)) { // 若旧节点有子节点，就把所有的子节点删除
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    api.setTextContent(elm, vnode.text!); // 把新节点的text赋予给真实dom
  }
  hook?.postpatch?.(oldVnode, vnode); // 更新视图
}
```

## 传统diff算法

传统diff算法
- 虚拟dom中的diff算法
- 传统算法查找两颗树每一个节点的差异
- 会运行n1（dom1的节点数）*n2（dom2的节点数）次方去对比，找到差异的部分再去更新

snabbdom的diff算法优化
- Snabbdom根据DOM的特点对传统的diff算法做了优化
- DOM操作时候很少会跨级别操作节点
- 只比较同级别的节点

## updateChildren：判断子节点的差异

- 声明变量
- 同级别节点比较
- 循环结束的收尾工作

- 同级别节点比较的5种情况：
  - oldAStartVnode/newStartVnode（旧开始节点、新开始节点）相同
  - oldEndVnode/newEndVnode（旧结束节点、新结束节点）相同
  - oldStartVnode/newEndVnode（旧开始节点、新结束节点）相同
  - oldEndVnode/newStartVnode（旧结束节点、新开始节点）相同
  - 特殊情况当1234的情况都不符合的时候就会执行，在oldVnodes里面寻找跟newStartVnode一样的几点然后位移到oldStartVnode，若没有找到就在oldStartVnode创建一个
- 执行过程是一个循环，在每次循环里，只要执行了上述的情况的5种之一就会结束一次循环
- 循环结束的首位工作：知道oldStartIdx > oldEndIds || newStartIdx > newEndIdx（代表旧节点或者新节点已经遍历完）


若情况1符合:
- (从新旧节点的开始节点开始对比,oldCh[oldStartIdx]和newCh[newStartIdx]进行sameVnode(key和sel相同)判断是否相同节点)
- 则执行patchVnode找出两者之间的差异,更新图;如没有差异则什么都不操作,结束一次循环
- oldStartIdx++/newStartIdx++

若情况2符合
- (从新旧节点的结束节点开始对比,oldCh[oldEndIdx]和newCh[newEndIdx]对比,执行sameVnode(key和sel相同)判断是否相同节点)
- 执行patchVnode找出两者之间的差异,更新视图,;如没有差异则什么都不操作,结束一次循环
- oldEndIdx--/newEndIdx--

若情况3符合
- (旧节点的开始节点与新节点的结束节点开始对比,oldCh[oldStartIdx]和newCh[newEndIdx]对比,执行sameVnode(key和sel相同)判断是否相同节点)
- 执行patchVnode找出两者之间的差异,更新视图,如没有差异则什么都不操作,结束一次循环
- oldCh[oldStartIdx]对应的真实dom位移到oldCh[oldEndIdx]对应的真实dom后
- oldStartIdx++/newEndIdx--;

若情况4符合
- (旧节点的结束节点与新节点的开始节点开始对比,oldCh[oldEndIdx]和newCh[newStartIdx]对比,执行sameVnode(key和sel相同)判断是否相同节点)
- 执行patchVnode找出两者之间的差异,更新视图,如没有差异则什么都不操作,结束一次循环
- oldCh[oldEndIdx]对应的真实dom位移到oldCh[oldStartIdx]对应的真实dom前
- oldEndIdx--/newStartIdx++;

情况5
- 从旧节点里面寻找,若寻找到与newCh[newStartIdx]相同的节点(且叫对应节点[1]),执行patchVnode找出两者之间的差异,更新视图,如没有差异则什么都不操作,结束一次循环
- 对应节点[1]对应的真实dom位移到oldCh[oldStartIdx]对应的真实dom前
- 若没有寻找到相同的节点,则创建一个与newCh[newStartIdx]节点对应的真实dom插入到oldCh[oldStartIdx]对应的真实dom前
- newStartIdx++

收尾工作：(oldStartIdx > oldEndIdx || newStartIdx > newEndIdx)
- 新节点的所有子节点 先遍历完(newStartIdx > newEndIdx)，循环结束
- 新节点的所有子节点 遍历结束就是把没有对应相同节点的 子节点 删除
- 旧节点的所有子节点 先遍历完(oldStartIdx > oldEndIdx)，循环结束
- 旧节点的所有子节点 遍历结束就是在多出来的 子节点 插入到 旧节点结束节点 前(newCh[newEndIdx+1].elm)，就是对应的旧结束节点的真实dom，newEndIdx+1是因为在匹配到相同的节点需要-1，所以需要加回来就是结束节点。

```js
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    let oldStartIdx = 0;                // 旧节点开始节点索引
    let newStartIdx = 0;                // 新节点开始节点索引
    let oldEndIdx = oldCh.length - 1;   // 旧节点结束节点索引
    let oldStartVnode = oldCh[0];       // 旧节点开始节点
    let oldEndVnode = oldCh[oldEndIdx]; // 旧节点结束节点
    let newEndIdx = newCh.length - 1;   // 新节点结束节点索引
    let newStartVnode = newCh[0];       // 新节点开始节点
    let newEndVnode = newCh[newEndIdx]; // 新节点结束节点
    let oldKeyToIdx;                    // 节点移动相关
    let idxInOld;                       // 节点移动相关
    let elmToMove;                      // 节点移动相关
    let before;


    // 同级别节点比较
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newStartVnode)) { // 判断情况1
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (sameVnode(oldEndVnode, newEndVnode)) {   // 情况2
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right情况3
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
            api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left情况4
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
            api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {                                             // 情况5
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (isUndef(idxInOld)) { // New element        // 创建新的节点在旧节点的新节点前
                api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            }
            else {
                elmToMove = oldCh[idxInOld];
                if (elmToMove.sel !== newStartVnode.sel) { // 创建新的节点在旧节点的新节点前
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                }
                else {
                                                           // 在旧节点数组中找到相同的节点就对比差异更新视图,然后移动位置
                    patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                    oldCh[idxInOld] = undefined;
                    api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    // 循环结束的收尾工作
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
            // newCh[newEndIdx + 1].elm就是旧节点数组中的结束节点对应的dom元素
            // newEndIdx+1是因为在之前成功匹配了newEndIdx需要-1
            // newCh[newEndIdx + 1].elm,因为已经匹配过有相同的节点了,它就是等于旧节点数组中的结束节点对应的dom元素(oldCh[oldEndIdx + 1].elm)
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            // 把新节点数组中多出来的节点插入到before前
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else {
            // 这里就是把没有匹配到相同节点的节点删除掉
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
}
```

### key的作用

- Diff操作可以更加快速
- Diff操作可以更加准确（避免渲染错误）
- 不推荐使用索引作为key（增加不必要的更新操作）
