# 翻转链表

<!-- https://leetcode-cn.com/problems/reverse-linked-list-ii/solution/bu-bu-chai-jie-ru-he-di-gui-di-fan-zhuan-lian-biao/ -->

## 递归反转整个链表

```js
ListNode reverse(ListNode head) {
    if (head.next == null) return head;
    ListNode last = reverse(head.next);
    head.next.next = head;
    head.next = null;
    return last;
}
```

reverse的定义：输入一个节点head，将以head为起点的链表反转，并返回反转之后的头结点

h
1->2->3->4->5->6->n

h
1->reverse(2->3->4->5->6->n)

h               l
1->(2<-3<-4<-5<-6)

```js
head.next.next = head; => 2 -> 1
head.next = null; => 1 -> n
return last;
```

## 反转链表前N个节点

```js
ListNode successor = null;      // 后驱节点
// 反转以head为起点的n个几点，返回新的头结点
ListNode reverseN(ListNode head, int n) {
    if (n == 1) {
        // 记录第n+1个节点
        successor = head.next;
        return head;
    }
    // 以head.next为起点，需要反转前n-1个节点
    ListNode last = reverseN(head.next, n - 1);
    head.next.next = head;
    // 让反转之后的head节点和后面的节点连起来
    head.next = successor;
    return last;
}
```

h     l s
1<-2<-3 4->5->6->n

## 反转链表的一部分

[m,n]索引区间的反转

如果m==1，就相当于反转链表开头的n个元素。

如果m!=1？如果我们把head的索引视为1，那么我们是想从第m个元素开始反转；如果把head.next的索引视为1，那么反转的区间应该是从第m-1个元素开始的。。。

```js
ListNode reverseBetween(ListNode head, int m, int n) {
    // base case
    if (m == 1) {
        // 相当于反转前n个元素
        return reverseN(head, n);
    }
    // 前进到反转的起点触发base case
    head.next = reverseBetween(head.next, m - 1, n - 1);
    return head;
}
```
