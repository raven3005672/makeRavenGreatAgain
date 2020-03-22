# 二叉树的遍历

<!-- https://github.com/Alex660/Algorithms-and-data-structures/blob/master/demos/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E4%B8%89%E5%BA%8F%E9%81%8D%E5%8E%86.md -->

![img](https://camo.githubusercontent.com/f5bff6fd9208fe6fda2ce71f820ceedad7f2527f/68747470733a2f2f7374617469633030312e6765656b62616e672e6f72672f7265736f757263652f696d6167652f61622f31362f61623130333832326537356235623135633631356236383536306362323431362e6a7067)

* 前序：根->左->右
* 中序：左->根->右
* 后序：左->右->根

## 三序遍历解法

* 递归
* 模拟栈/迭代
    * I/II/III/IV
* 转换
    * 只针对前/后序遍历
* 线索二叉树/莫里斯遍历

### 递归

#### 前序：根->左->右

preOrder(r);
    print r;
    preOrder(r->left);
    preOrder(r->right);

```js
var preorderTraversal = function(root) {
    var result = [];
    function pushRoot(node){
        if(node != null){
            result.push(node.val);
            if(node.left != null){
                pushRoot(node.left);
            }
            if(node.right != null){
                pushRoot(node.right);
            }
        }
    }
    pushRoot(root);
    return result;
};
```

#### 中序：左->根->右

inOrder(r);
    inOrder(r->left);
    print r;
    inOrder(r->right);

```js
var inorderTraversal = function(root) {
    var result = [];
    function pushRoot(root){
        if(root != null){
            if(root.left != null){
                pushRoot(root.left);
            }
            result.push(root.val);
            if(root.right !=null){
                pushRoot(root.right);
            }
        }
    }
    pushRoot(root);
    return result;
};
```

#### 后序：左->右->根

postOrder(r);
    postOrder(r->left);
    postOrder(r->right);
    print r;

```js
var postorderTraversal = function(root) {
    var result = [];
    function pushRoot(node){
        if(node != null){
            if(node.left != null){
                pushRoot(node.left);
            }
            if(node.right != null){
                pushRoot(node.right);
            } 
            result.push(node.val);
        }
    }
    pushRoot(root);
    return result;
};
```

### 模拟栈-I

由三序定义和其图解操作可知：

* 对于二叉树任何一个节点而言，我们对它只有两种操作
    * 一是将它作为根节点，在三序相应的遍历顺序中，取出其中的值作为结果集的一部分
    * 二是继续探索它的左右子树，按照三序的定义顺序来操作
* 因此我们对任意一个节点附加一个标识
    * true：表示当前节点时三序遍历中相应顺序的根节点，碰到需要加入结果集
    * false：表示此节点属于三序遍历中的左右子树的操作，需要压入栈中
* 栈——先进后出
* 通过栈编写三序遍历时，代码编写顺序使其倒序
    * 前序：右-左-根
    * 中序：右-根-左
    * 后序：根-右-左

```js
// 前序
var preorderTraversal = function(root) {
    let res = [];
    if (!root) {
        return res;
    }
    let stack = [[root, false]];
    while (stack.length > 0) {
        let node = stack.pop();
        let curr = node[0];
        let isTrue = node[1];
        if (isTrue) {
            res.push(curr.val);
        } else {
            if (curr.right) {
                stack.push([curr.right, false]);
            }
            if (curr.left) {
                stack.push([curr.left, false]);
            }
            stack.push([curr, true]);
        }
    }
    return res;
}
// 中序
var inorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [[root,false]];
    while(stack.length > 0){
        let node = stack.pop();
        let curr = node[0];
        let isTrue = node[1];
        if(isTrue){
            res.push(curr.val);
        }else{
            if(curr.right){
                stack.push([curr.right,false]);
            }
            stack.push([curr,true]);
            if(curr.left){
                stack.push([curr.left,false]);
            }
        }
    }
    return res;
};
// 后序
var postorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [[root,false]];
    while(stack.length > 0){
        let node = stack.pop();
        let curr = node[0];
        let isTrue = node[1];
        if(isTrue){
            res.push(curr.val);
        }else{
            stack.push([curr,true]);
            if(curr.right){
                stack.push([curr.right,false]);
            }
            if(curr.left){
                stack.push([curr.left,false]);
            }
        }
    }
    return res;
};
```

### 模拟栈-II

* 前序
    1. 申请一个stack，将当前遍历节点保存在栈中
    2. 对当前节点的左子树重复过程1，直到左子树为空
    3. 出栈当前节点，对当前节点的右子树重复过程1
    4. 直到遍历完所有节点
* 中序：略
* 后序
    * 参考-转换-后序-解法二

```js
// 前序
var preorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [];
    let curr = root
    while(curr != null || stack.length > 0){
        if(curr){
            res.push(curr.val);
            stack.push(curr);
            curr = curr.left;
        }else{
            let node = stack.pop();
            curr = node.right;
        }
    }
    return res;
};
// 中序
var inorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [];
    let curr = root
    while(curr != null || stack.length > 0){
        if(curr){
            stack.push(curr);
            curr = curr.left;
        }else{
            let node = stack.pop();
            res.push(node.val);
            curr = node.right;
        }
    }
    return res;
};
// 后序
var postorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [];
    let curr = root
    while(curr != null || stack.length > 0){
        if(curr){
            res.unshift(curr.val);
            stack.push(curr);
            curr = curr.right;
        }else{
            let node = stack.pop();
            curr = node.left;
        }
    }
    return res;
};
```

### 模拟栈-III

* 前序
    * 遇到根，直接入结果集
    * 先入栈右边，然后【后】出栈右边，到时入结果集
    * 后入栈左边，然后【先】出栈左边，到时入结果集
* 中序：略
* 后序
    * 参考-转换-后序-解法一

```js
// 前序
var preorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [root];
    while(stack.length > 0){
        let curr = stack.pop();
        // 遇到根，直接入结果集
        res.push(curr.val);
        // 先入栈右边，这样后出栈
        if(curr.right){
            stack.push(curr.right);
        }
        // 后入栈左边，这样先出栈左边 
        if(curr.left){
            stack.push(curr.left);
        }
    }
    return res;
};
// 中序：略
// 后序
var postorderTraversal = function(root) {
    let res = [];
    if(!root){
        return res;
    }
    let stack = [root];
    while(stack.length > 0){
        let curr = stack.pop();
        if(curr.left){
            stack.push(curr.left);
        }
        if(curr.right){
            stack.push(curr.right);
        }
        res.unshift(curr.val);
    }
    return res;
};
```

### 模拟栈-IV

* 前序：
    * 遍历循序：根-右-左
    * 结果顺序：根-左-右
* 中序：
    * 遍历顺序：右-根-左
    * 结果顺序：左-根-右
* 后序：
    * 将前序转换（翻转）一下就可
        * 前序遍历顺序：根-右-左
        * 转换（翻转）顺序：左-右-根
    * 参考-转换-后序-解法三

```js
// 前序
var preorderTraversal = function(root) {
    let res = [];
    let stack = [];
    let curr = root;
    while(stack.length > 0 || curr){
        while(curr){
            res.push(curr.val);
            stack.push(curr);
            curr = curr.left;
        }
        let node = stack.pop();
        curr = node.right;
    }
    return res;
};
// 中序
var inorderTraversal = function(root) {
    let res = [];
    let stack = [];
    let curr = root;
    while(stack.length > 0 || curr){
        while(curr){
            stack.push(curr);
            curr = curr.left;
        }
        let node = stack.pop();
        res.push(node.val);
        curr = node.right;
    }
    return res;
};
// 后序
var postorderTraversal = function(root) {
    let res = [];
    let stack = [];
    let curr = root;
    while(stack.length > 0 || curr){
        while(curr){
            stack.push(curr);
            res.unshift(curr.val);
            curr = curr.right;
        }
        let node = stack.pop();
        curr = node.left;
    }
    return res;
};
```

### 转换

* 前序-略
* 中序-略
* 后序-相对于前序遍历，反转结果即可

### 线索二叉树/莫里斯遍历

略
