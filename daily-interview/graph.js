// 无向图
function Graph() {
    this.vertices = [];          // 顶点集合
    this.edges = new Map();      // 边集合
}
Graph.prototype.addVertex = function(v) {   // 添加顶点方法
    this.vertices.push(v);
    this.edges.set(v, []);
}
Graph.prototype.addEdge = function(v, w) {  // 添加边方法
    let vEdge = this.edges.get(v);
    vEdge.push(w);
    this.edges.set(v, vEdge);

    let wEdge = this.edges.get(w);
    wEdge.push(v);
    this.edges.set(w, wEdge);
}
Graph.prototype.toString = function() {
    var s = '';
    for (var i = 0; i < this.vertices.length; i++) {
        s += this.vertices[i] + ' -> ';
        var neighors = this.edges.get(this.vertices[i]);
        for (var j = 0; j < neighors.length; j++) {
            s += neighors[j] + ' ';
        }
        s += '\n';
    }
    return s;
}

Graph.prototype.dfs = function() {
    var marked = [];

    for (var i=0; i<this.vertices.length; i++) {
        if (!marked[this.vertices[i]]) {
            dfsVisit(this.vertices[i], this);
            // dfsVisit.apply(this, [this.vertices[i]])
        }
    }

    function dfsVisit(u, thisArg) {
        let edges = thisArg.edges;
        marked[u] = true;
        console.log(u);
        var neighbors = edges.get(u);
        for (var i=0; i<neighbors.length; i++) {
            var w = neighbors[i];
            if (!marked[w]) {
                dfsVisit(w, thisArg);
            }
        }
    }

}

// test
var graph = new Graph();
var vertices = [1, 2, 3, 4, 5];
for (var i=0; i<vertices.length; i++) {
    graph.addVertex(vertices[i]);
}
graph.addEdge(1, 4); //增加边
graph.addEdge(1, 3);
graph.addEdge(2, 3);
graph.addEdge(2, 5);

console.log(graph.toString());
// 1 -> 4 3 
// 2 -> 3 5 
// 3 -> 1 2 
// 4 -> 1 
// 5 -> 2

// 深度优先遍历DFS
// 沿着树的深度遍历树的节点，尽可能深地搜索树的分支。当节点v的所有边都被探寻过，将回溯到发现节点v的那条边的起始节点。
// 这一过程一直进行到已探寻源节点到其他所有节点为止，如果还有未被发现的节点，则选择其中一个未被发现的节点为源节点并重复以上操作，直到所有节点都被探寻完成。
// DFS可以产生相应图的拓扑排序表，可以用来解决最大路径问题。一般用堆数据结构来辅助实现DFS算法。
// 深度DFS属于盲目搜索，无法保证搜索到的路径为最短路径，也不是在搜索特定的路径，而是通过搜索来查看图中有哪些路径可以选择。
// 步骤：
// 访问顶点v
// 依次从v的未被访问的临接点出发，对图进行深度优先遍历，直至图中和v有路径相同的顶点都被访问
// 若此时图中尚有顶点未被访问，则从一个未被访问的顶点出发，重新进行深度优先遍历，直到所有顶点均被访问过为止

graph.dfs();
// 1
// 4
// 3
// 2
// 5





// 另一种回答
// domTree
let deepTraversal1 = (node, nodeList = []) => {
    if (node !== null) {
        nodeList.push(node);
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            deepTraversal1(children[i], nodeList);
        }
    }
}
let deepTraversal2 = (node) => {
    let nodes = [];
    if (node !== null) {
        nodes.push(node);
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            nodes = nodes.concat(deepTraversal2(children[i]));
        }
    }
    return nodes;
}
// 非递归 bfs?
let deepTraversal3 = (node) => {
    let stack = []
    let nodes = []
    if (node) {
        // 推入当前处理的node
        stack.push(node)
        while(stack.length) {
            let item = stack.pop();
            let children = item.children;
            nodes.push(item);
            // node = [] stack = [parent]
            // node = [parent] stack = [child3, child2, child1]
            // node = [parent, child1] stack = [child3, child2, child1-2, child1-1]
            // node = [parent, child1-1] stack = [child3, child2, child1-2]
            for (let i = children.length - 1; i >= 0; i--) {
                stack.push(children[i]);
            }
        }
    }
    return nodes
}
let widthTraversal2 = (node) => {
    let nodes = [];
    let stack = [];
    if (node) {
        stack.push(node)
        while (stack.length) {
            let item = stack.shift();
            let children = item.children;
            nodes.push(item);
            // 队列，先进先出
            // nodes = [] stack = [parent]
            // nodes = [parent] stack = [child1, child2, child3]
            // nodes = [parent, child1] stack = [child2, child3, child1-1, child1-2]
            // nodes = [parent, child1, child2] stack = [child3, child1-1, chidl1-2, child2-1]
            for (let i = 0; i < children.length; i++) {
                stack.push(children[i]);
            }
        }
    }
    return nodes;
}
