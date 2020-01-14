堆
最小值在顶部

二叉树
最小值是最左子节点，最大值是最右子节点

<!-- 找链表中点p -->
let pre = head;
    let p = pre.next;
    let q = p.next;
    // 找链表中点p
    while (q != null && q.next != null) {
        pre = pre.next;
        p = pre.next;
        q = q.next.next;
    }