# 动态规划

## 动态规划的三大步骤

动态规划，就是利用历史记录，来避免我们的重复计算。这些历史记录，我们得需要一些变量来保存，一般是用一维数组或者二维数组来保存。

1. 定义数组元素的含义。
    * 一维：dp[i]，二维：dp[i][j]
2. 找出数组元素之间的关系式。
    * 类似于归纳法，利用dp[n-1],dp[n-2]...dp[1]来推导出dp[n]，也就是利用历史数据来推出新的元素值。
    * 最优子结构，把大的问题拆成小的问题。
3. 找出初始值。

## 案例

### 简单的一维DP

一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级台阶，总共有多少种跳法。

1. step1，定义dp[i]的含义
    * 我们的问题是要求青蛙跳上n级的台阶总共由多少种跳法，那我们就定义dp[i]的含义为：跳上一个i级的台阶总共由dp[i]种跳法。
2. step2，找出数组元素间的关系式
    * 逆推：青蛙到达第n级的台阶有两种方式：一种是从第n-1级跳上来；一种是从第n-2级跳上来
    * dp[n] = dp[n-1] + dp[n-2]
3. step3，找出初始条件
    * dp[0] = 0, dp[1] = 1, dp[2] = 2, 即n<=2时，dp[n] = n
4. (step4，初始条件的严谨性)
    * 注意dp[2] = 2 != 1 + 0

```js
function answer(n) {
    if (n <= 2) return n;
    let dp = [];
    dp[0] = 0;
    dp[1] = 1;
    dp[2] = 2;
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

### 二维数组的dp

一个机器人位于一个m x n网格的左上角，机器人每次只能向下或者向右移动一步，问到终点右下角有多少条不同的路径。

![img](https://pic1.zhimg.com/v2-bbbe99e44d3a46fae8a6529a25452f98_b.jpg)

1. step1，定义数组元素的含义
    * dp[i][j]的含义为：当机器人从左上角走到(i,j)这个位置时，一共有dp[i][j]种路径。所以dp[m-1][n-1]就是我们要的答案。
    * 注意这个网格相当于一个二维数组，数组是从下标为0开始算起的，所以右下角的位置是(m-1,n-1)
2. step2，找出关系数组元素间的关系式
    * 到达(i,j)位置有两种方式：一种是从(i-1,j)走一步，一种是从(i,j-1)走一步。
    * dp[i][j] = dp[i-1][j] + dp[i][j-1]
3. step3，找出初始值
    * dp[0][0...n-1] = 1，最上面一行，机器人只能一直往右走
    * dp[0...m-1][0] = 1，最左边一列，机器人智能一直往下走

```js
var uniquePaths = function(m, n) {
    if (m <= 0 || n <= 0) return 0;
    let dp = [];
    for (let i = 0; i < m; i++) {
        dp.push([]);
        for (let j = 0; j < n; j++) {
            if (i * j == 0) {
                dp[i][j] = 1;
            } else {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
    }
    return dp[m-1][n-1];
};
```

O(n*m)的空间复杂度可以优化成O(min(n,m))的空间复杂度，不过这里先不讲。

### 二维数组DP

给定一个包含非负整数的m x n网格，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。（每次只能向下或者向右移动一步）

举例：
输入:
arr = [
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
输出: 7
解释: 因为路径 1→3→1→1→1 的总和最小。

1. step1，定义数组元素的含义
    * dp[i][j]的含义：当机器人从左上角走到(i,j)这个位置时，最小的路径和是dp[i][j]。那么dp[m-1][n-1]就是我们要的答案。
2. step2，找出关系数组元素间的关系式
    * 机器人要到达(i,j)这个位置有两种方式：一种是从(i-1,j)这个位置走一步，一种是从(i,j-1)这个位置走一步
    * dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + arr[i][j];   arr[i][j]表示网格中的值
3. step3，找出初始值
    * dp[0][j] = arr[0][j] + dp[0][j-1];
    * dp[i][0] = arr[i][0] + dp[i-1][0];

```js
var minPathSum = function(grid) {
    let dp = [];
    let m = grid.length;
    let n = grid[0].length;
    for (let i = 0; i < m; i++) {
        dp.push([]);
        if (i === 0) {
            dp[i][0] = grid[i][0];
        } else {
            dp[i][0] = dp[i-1][0] + grid[i][0];
        }
        for (let j = 0; j < n; j++) {
            if (i * j === 0) {
                if (j === 0) {
                    dp[0][j] = grid[0][j];
                } else {
                    dp[0][j] = dp[0][j-1] + grid[0][j];
                }
            } else {
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
            }
        }
    }
    return dp[m-1][n-1];
};
```

O(n*m)的空间复杂度可以优化成O(min(n,m))的空间复杂度，不过这里先不讲。

### 编辑距离

给定两个单词word1和word2，计算出将word1转换成word2所使用的最少操作数。

你可以对一个单词进行如下三种操作：插入一个字符、删除一个字符、替换一个字符

示例：
输入: word1 = "horse", word2 = "ros"
输出: 3
解释: 
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')

1. step1，定义数组元素的含义
    * dp[i][j]的含义为：当字符串word1的长度为i，字符串word2的长度为j时，将word1转化为word2所使用的最少操作次数[i][j]
2. step2，找出关系数组元素间的关系式
    * 如果word1[i]和word2[j]相等，这个时候不要进行任何操作，显然有dp[i][j] = dp[i-1][j-1]
    * 如果word1[i]和word2[j]不相等，这个时候我们就必须进行调整
        * 如果把字符word1[i]替换成word2[j]相等，则有dp[i][j] = dp[i-1][j-1] + 1
        * 如果把字符串word1末尾插入一个与word2[j]相等的字符，则有dp[i][j] = dp[i][j-1] + 1;
        * 如果把字符word1[i]删除，则有dp[i][j] = dp[i-1][j] + 1
        * 所以有dp[i][j] = min(dp[i-1][j-1], dp[i][j-1], dp[i-1][j]) + 1
3. step3，找出初始值
    * 如果i或者j有一个为0，所以我们的初始值是计算出所有的dp[0][0...n]和所有的dp[0...m][0]

```js
var minDistance = function(word1, word2) {
    let dp = [];
    let m = word1.length,
        n = word2.length;
    dp.push([])
    dp[0][0] = 0;
    for (let i = 1; i <= m; i++) {
        dp.push([]);
        dp[i][0] = dp[i-1][0] + 1;
    }
    for (let j = 1; j <= n; j++) {
        dp[0][j] = dp[0][j-1] + 1;
    }
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(dp[i-1][j-1], dp[i][j-1], dp[i-1][j]) + 1;
            }
        }
    }
    return dp[m][n]
};
```

## 如何优化

优化核心：画图！

### O(n*m)空间复杂度优化成O(n)

案例1：最多路径数

dp矩阵
1-1-1-1

1-1-1-1
1-2-3-4

当我们要填充第三行的值的时候，我们不需要用到第一行的值，只需要用到前一行的值就够了，所以使用一个一维数组即可。

```js
var uniquePaths = function(m, n) {
    if (m <= 0 || n <= 0) return 0;
    let dp = [];
    for (let i = 0; i < n; i++) {
        dp[i] = 1;
    }
    for (let i = 0; i < m; i++) {
        dp[0] = 1;
        for (let j = 0; j < n; j++) {
            dp[j] = dp[j-1] + dp[j];
        }
    }
    return dp[n-1];
};
```

案例2：编辑距离

dp矩阵

_ - _ - _ - _
_ - _ - _ - _
_ - _ - ij- _
_ - _ - _ - _

我们需要一个额外的变量pre来时刻保存(i-1,j-1)的值。

推导公式:
二维的: dp[i][j] = min(dp[i-1][j], dp[i-1][j-1], dp[i][j-1]) + 1
一维的: dp[i] = min(dp[i - 1], pre, dp[i]) + 1

```js
var minDistance = function(word1, word2) {
    let dp = [];
    let m = word1.length,
        n = word2.length;

    for (let j = 0; j <= n; j++) {
        dp[j] = j;
    }
    for (let i = 1; i <= m; i++) {
        let temp = dp[0];
        dp[0] = i;
        for (let j = 1; j <= n; j++) {
            let pre = temp;
            temp = dp[j];
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[j] = pre;
            } else {
                dp[j] = Math.min(dp[j-1], pre, dp[j]) + 1;
            }
        }
    }
    return dp[n];
};
```
