// 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制 。

// 实现 LRUCache 类：
// LRUCache(int capacity) 以正整数作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

// 题目要求的1和2相对简单，主要是条件3，当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值。容量和条件1相呼应，关键是怎么理解最久未使用呢?

// 读和写都是在使用数据
// 假设不管是读还是写，我们都把对应的key值放到数组的末尾，那么是不是意味着数组的头部就是最久未使用的了呢？


// 数组对象实现
var LRUCache = function (capacity) {
  // 用数组记录读和写的顺序
  this.keys = [];
  // 用对象来保存key value值
  this.cache = {};
  // 容量
  this.capacity = capacity;
}

LRUCache.prototype.get = function (key) {
  // 如果存在
  if (this.cache[key]) {
    // 先删除原来的位置
    remove(this.keys, key);
    // 再移动到最后一个，以保持最新访问
    this.keys.push(key);
    // 返回值
    return this.cache[key];
  }
  return -1;
}

LRUCache.prototype.put = function (key, value) {
  if (this.cache[key]) {
    // 存在的时候先更新值
    this.cache[key] = value;
    // 再更新位置到最后一个
    remove(this.keys, key);
    this.keys.push(key);
  } else {
    // 不存在的时候加入
    this.keys.push(key);
    this.cache[key] = value;
    // 容量如果超过了最大值，则删除最久未使用的（也就是数组中的第一个key）
    if (this.keys.length > this.capacity) {
      removeCache(this.cache, this.keys, this.keys[0]);
    }
  }
}

function remove(arr, key) {
  if (arr.length) {
    const index = arr.indexOf(key);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

function removeCache(cache, keys, key) {
  cache[key] = null;
  remove(keys, key);
}

// --------------------------------------------------------

// Map实现
var LRUCache = function (capacity) {
  this.cache = new Map();
  this.capacity = capacity;
}

LRUCache.prototype.get = function (key) {
  // 如果存在
  if (this.cache.has(key)) {
    const value = this.cache.get(key);
    // 更新位置
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  return -1;
}

LRUCache.prototype.put = function (key) {
  // 已经存在的情况下，更新其位置到”最新“即可
  // 先删除，后插入
  if (this.cache.has(key)) {
    this.cache.delete(key);
  } else {
    // 插入数据前先判断，size是否符合capacity
    // 已经>=capacity，需要把最开始插入的数据删除掉
    // keys()方法得到一个可遍历对象,执行next()拿到一个形如{ value: 'xxx', done: false }的对象
    if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }

  this.cache.set(key, value);
}