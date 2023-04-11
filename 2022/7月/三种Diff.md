# 三种Diff

## 简单Diff算法

### 核心逻辑

拿新的一组子节点中的节点去旧的一组子节点中寻找可复用的节点。如果找到了，则记录该节点的位置索引。把这个位置索引称为**最大索引（lastIndex）**。在整个更新过程中，如果一个节点的索引值小于最大索引，则说明该节点对应的真实DOM元素需要移动。

### 实现思路

- 依次遍历新children，去旧children中查找具有相同key的可复用节点。如果找到对应旧节点的索引小于lastIndex（最大索引），则说明该节点需要移动，反之更新lastIndex。
- 若新节点没在旧children中找到可复用节点，则在当前新节点的上一个节点之后插入新节点。
- 遍历旧children，查找是否有不存在新children中的节点，如果有则卸载该节点。

### 简单Diff过程

```
旧子节点：p-1, p-2, p-3
新子节点：p-3, p-1, p-2
```

1. 定义最大索引lastIndex初始值为0
2. 遍历新的一组子节点
   1. 新子节点第一个节点p-3，去旧子节点中查找到相同key的节点索引为2，不小于当前最大索引值lastIndex 0，则不需要移动，**更新lastIndex值为2**
   2. 新子节点第二个节点p-1，去旧子节点中查找到相同key的节点索引为0，小于当前最大索引值lastIndex 2，则说明该节点对应的真实DOM需要移动到上一节点p-3的兄弟节点之前，此时，由于p-3在**真实DOM子节点中是最后一个子节点**，没有兄弟节点，则插入到末尾。
   3. 新子节点第二个节点p-2，去旧子节点中查找到相同key的节点索引为1，小于当前最大索引值lastIndex 2，则说明改节点对应的真实DOM需要移动到上一节点p-1的兄弟节点之前，此时，由于p-1在**真实DOM子节点中是最后一个子节点**，没有兄弟节点，则插入到末尾。

至此，Diff过程结束。可以发现在本例中使用简单Diff算法进行渲染更新需要两次DOM操作（p-1移动，p-2移动）。

## 双端Diff算法

双端Diff算法是Vue.js 2用于比较新旧两个子节点的方式。

### 核心逻辑

在新旧两组子节点的四个端点之间分别进行比较，并试图找到可复用的节点。相比简单Diff算法，双端Diff算法的优势在于，对于同样的更新场景，执行的DOM移动操作次数更少。

### 实现思路

1. 首先，双端比较分四个步骤比较，如果找到可复用节点，进行patch，移动节点。
   1. 旧的一组子节点中的第一个子节点与新的一组子节点中的第一个子节点比较
   2. 旧的一组子节点中的最后一个子节点与新的一组子节点中的最后一个子节点比较
   3. 旧的一组子节点中的第一个子节点与新的一组子节点中的最后一个子节点比较
   4. 旧的一组子节点中的最后一个子节点与新的一组子节点中的第一个子节点比较
2. 以上对比都不满足，则遍历旧的一组子节点，寻找与newStartVNode拥有相同key值的元素
   1. 找到了可复用节点，进行patch，然后将该节点插入到oldStartVNode之前，newStartIdx索引继续移动
   2. 未找到可复用节点，创建和挂载新节点
3. 循环结束检查索引值情况，处理剩余节点，新增或删除节点

## 快速Diff算法

快速Diff算法是Vue.js 3用于比较新旧两个子节点的方式。

**相同的前置元素和后置元素**——不同于简单Diff算法那和双端Diff算法，快速Diff算法包含预处理步骤，这其实是借鉴了纯文本Diff算法的思路。

### 纯文本Diff算法

先进行全等比较，也称为快捷路径。

```js
if(text1 === text2) return
```

处理两段文本相同的前缀和后缀。

```js
TEXT1: I use vue for app development
TEXT2: I use react for app development
```

对于内容相同的元素不需要进行核心Diff操作，真正需要进行Diff操作的部分是：

```js
TEXT1: vue
TEXT2: react
```

这实际是简化问题的一种方式，这么做的好处是，在特定情况下我们能够轻松地判断文本的插入和删除。

```js
TEXT1: I like you
TEXT2: I like you too

TEXT1: 
TEXT2: too
// TEXT2在TEXT1基础上增加字符串too

TEXT1: I like you too
TEXT2: I like you

TEXT1: too
TEXT2:
// TEXT2在TEXT1基础上删除字符串too
```

### 预处理

#### 新增节点

             j    newEnd
新子节点：p-1, ......... , p-2, p-3
旧子节点：p-1,         p-2, p-3
        oldEnd        j
两组子节点具有相同的前置节点p-1，以及相同的后置节点p-2，p-3

- j > oldEnd，说明在预处理过程中，所有的旧节点都处理完毕了
- j <= newEnd，说明在预处理过后，在新的一组子节点中，仍然有未被处理的子节点，而这些遗留的节点将被视作新增节点

#### 删除节点

       newEnd             j
新子节点：p-1,             p-3
旧子节点：p-1, ......... , p-3
             j     oldEnd

- j > endEnd，说明在预处理过程中，所有的新节点都处理完毕了
- j <= oldEnd，说明在预处理过后，在旧的一组子节点中，仍然有未被处理的子节点，而这些遗留的节点将被视作删除节点

对于相同的前置节点和后置节点，由于它们在新旧两组子节点中的相对位置不变，所以我们无需移动它们，但仍然需要再它们之间打补丁。

#### 判断是否需要进行DOM移动操作

上面预处理过程是处理比较理想化的情况，当处理完相同的前置节点和后置节点后，新旧两组子节点中总会有一组子节点全部被处理完毕。在这种情况下，只需要简单地挂载、卸载节点即可。但有时情况会比较复杂。

经过预处理后，新旧两组子节点中都有部分节点未被处理，这时就需要进一步处理。怎么处理呢？

- 判断是否有节点需要移动，以及应该如何移动；
- 找出那些需要被添加或移除的节点。

代码实现上，预处理过程中处理了理想的新增和删除情况，我们需要增加一个 else 分支来处理非理想情况

构建一个数组source，它的长度等于新的一组子节点在经过预处理之后剩余未处理节点数量，数组source中每个元素分别与新的一组子节点中剩余未处理节点对应，并且source中每个元素的初始值都是-1.

source数组将用来存储新的一组子节点中的节点在旧的一组子节点的位置索引，后面将会使用它计算出一个**最长递增子序列**，并用于辅助完成DOM移动的操作。

#### 判断节点是否需要移动

如果在子节点遍历过程中遇到的索引值呈现递增趋势，则说明不需要移动节点，反之则需要。

此处需要新增三个变量moved、pos和patched。
- moved初始值false，代表是否需要移动节点
- pos初始值0，代表遍历旧的一组子节点的过程中遇到的最大索引值k
- patched初始值0，代表已经更新过的节点数量。已经更新过的节点数量应该小于新的一组子节点中需要更新的节点数量。一旦前者超过后者，则说明有多余的节点，我们应该将他们卸载。

在第二个 for 循环内，通过比较变量 k 与变量 pos 的值来判断是否需要移动节点。

#### 计算source最长递增子序列

```js
// 预处理代码
function patchKeyedChildren(n1, n2, container) {
  const newChildren = n2.children;
  const oldChildren = n1.children;

  // 更新相同的前缀节点
  // 索引j指向新街两组子节点的开头
  let j = 0;
  let oldVNode = oldChildren[j];
  let newVNode = newChildren[j];
  // while循环向后遍历，知道遇到拥有不同key值的节点为止
  while (oldVNode.key === newVNode.key) {
    // 调用patch函数更新
    patch(oldVNode, newVNode, container);
    j++;
    oldVNode = oldChildren[j];
    newVNode = newChildren[j];
  }

  // 更新相同的后缀节点
  // 索引oldEnd指向旧的一组子节点的最后一个节点
  let oldEnd = oldChildren.length - 1;
  // 索引newEnd指向新的一组子节点的最后一个节点
  let newEnd = newChildren.length - 1;
  oldVNode = oldVNode[oldEnd];
  newVNode = newChildren[newEnd];
  // while循环向前遍历，知道遇到拥有不同key值的节点为止
  while (oldVNode.key === newVNode.key) {
    // 调用patch函数更新
    patch(oldVNode, newVNode, container);
    oldEnd--;
    newEnd--;
    oldVNode = oldChildren[oldEnd];
    newVNode = newChildren[newEnd];
  }

  // 满足条件，则说明从 j -> newEnd 之间的节点应作为新节点插入
  if (j > oldEnd && j <= newEnd) {
    // 锚点的索引
    const anchorIndex = newEnd + 1;
    // 锚点元素
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
    // 采用while循环，调用patch函数逐个挂载新增的节点
    while (j <= newEnd) {
      patch(null, newChildren[j++], container, anchor);
    }
  } else if (j > newEnd && j <= oldEnd) {
    // j -> oldEnd之间的节点应该被卸载
    while (j <= oldEnd) {
      unmount(oldChildren[j++])
    }
  } else {
    // 增加else分支来处理非理想情况
    // 构建source数组
    const count = newEnd - j + 1; // 新的一组子节点中剩余未处理节点的数量
    const source = new Array(count);
    source.fill(-1);

    // oldStart和newStart分别为起始索引，即j
    const oldStart = j;
    const newStart = j;
    // 新增两个变量 moved 和 pos
    let moved = false;
    let pos = 0;
    //构建索引表
    const keyIndex = {}
    for(let i = newStart; i <= newEnd; i++) {
      keyIndex[newChildren[i].key] = i
    }
    // 新增patched变量，代表更新过的节点数量
    let patched = 0
    // 遍历旧的一组子节点中剩余未处理的节点
    for(let i = oldStart; i <= oldEnd; i++) {
      oldVNode = oldChildren[i]
      if (patched < count) {
        // 通过索引表快速找到新的一组子节点中具有相同 key 的节点位置
        const k = keyIndex[oldVNode.key]
        
        if (typeof k !== 'undefined') {
          newVNode = newChildren[k]
          // 调用 patch 函数完成更新
          patch(oldVNode, newVNode, container)
          // 每更新一个节点，都将patched变量 + 1
          patched++
          // 填充 source 数组
          source[k - newStart] = i
          // 判断节点是否需要移动
          if (k < pos) {
            moved = true
          } else {
            pos = k
          }
        } else {
          // 没找到
          unmount(oldVNode)
        }
      } else {
        // 如果更新过的节点数量大于需要更新的节点数量，则卸载多余的几点
        unmount(oldVNode)
      }
    }
    if (moved) {
      // 如果moved为真，则需要进行DOM移动操作
      // 计算最长递增子序列
      const seq = getSequence(source);
      // s指向最长递增子序列的最后一个值
      let s = seq.length - 1;
      let i = count - 1;
      // for 循环使得i递减
      for (i; i >= 0; i--) {
        if (source[i] === -1) {
          // 说明索引为i的节点是全新的几点，应该将其挂载
          // 该节点在新children中的真实位置索引
          const pos = i + newStart
          const newVNode = newChildren[pos]
          // 该节点下一个节点的位置索引
          const nextPos = pos + 1
          // 锚点
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
          // 挂载
          patch(null, newVNode, container, anchor)
        } else if (i !== seq[s]) {
          // 说明该节点需要移动
          // 该节点在新的一组子节点中的真实位置索引
          const pos = i + newStart
          const newVNode = newChildren[pos]
          // 该节点下一个节点的位置索引
          const nextPos = pos + 1
          // 锚点
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el ? null;
          // 移动
          insert(newVNode.el, container, anchor)
        } else {
          // 当i===seq[s]时，说明该位置的节点不需要移动
          // 并让 s
          s--
        }
      }
    }
  }
}
```