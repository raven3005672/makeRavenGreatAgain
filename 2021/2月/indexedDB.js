// indexedDB是一个比较复杂的API,涉及不少概念，它把不同的实体，抽象成一个个对象接口

// 数据库
// 数据库是一系列相关的容器，每个域名（协议+端口+域名）都可以新建任意多个数据库， 同时indexedDB数据库有版本的概念，同一时刻只能有一个版本的数据库存在，如果要修改数据库结构，只能通过升级数据库版本完成

// 对象仓库
// 每个数据库包含若干个对象仓库， 类似于关系型数据库的表格

// 数据记录
// 对象仓库保存的数据记录，每个记录类似于关系型数据库的行，但是只有逐渐和数据体两部分，主键用来建立默认索引，必须是不同的

// 索引
// 为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引

// 事务
// 数据记录的读写和删改都要通过事务完成。事务对象提供error,about和complete三个事件，用来监听操作结果

// 打开数据库
var request = window.indexedDB.open(databaseName, version)
// 改方法接受两个参数，第一个参数是字符串，表示数据库的名字，如果指定的数据不存在，就会创建新的数据库，第二个是整数，表示数据库版本，如果省略，
// indexedDB.open()返回一个IDBRequest对象。这个对象通过三个事件error,success,upgradeneeded 处理数据库的操作结果
// error 事件表示打开数据库失败
request.onerror = function (event) {
  console.log('数据库打开失败')
}
// success 事件表示成功打开的数据
var db
request.onsuccess = function (event) {
  db.request.result
  console.log('数据库打开成功')
}
// success 事件表示成功打开的数据 此时通过request对象的result属性拿到数据库对象
var db
request.onsuccess = function (event) {
  db.request.result
  console.log('数据库打开成功')
}
// upgradeneeded 事件如果指定的版本号大于数据的实际版本号，就会发生数据库升级事件 此时通过request对象的result属性拿到数据库对象
var db;
request.onupgradeneeded = function (event) {
  db = event.target.result;
}

// 新建数据库
request.onupgradeneeded = function (event) {
  db = event.target.result
  var objectStore;
  if (!db.objectStoreNames.contains('person')) {
    objectStore = db.createObjectStore('person', { keyPath: 'id' })
  }
}

// 自动生成主键
var objectStore = db.createObjectStore('person', { autoIncrement: true })

request.onupgradeneeded = function (event) {
  db = event.target.result
  var objectStore = db.createObejctStore('person', { keyPath: 'id' })
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore.createIndex('email', 'email', { unique: false })
}


// 新增数据
function add() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person').add({ id: 1, name: '张三', 'age': 24, email: 'zhangsan@example.com' })

  request.onsuccess = function (event) {
    console.log("数据写入成功")
  }

  request.onerror = function (event) {
    console.log("数据写入失败")
  }
}
add()


// 读取数据
function read() {
  var transaction = db.transaction(['person'])
  var objectStore = transaction.objectStore('person')
  // objectStore.get(1) 参数是主键的值
  var request = objectStore.get(1)

  request.onerror = function (event) {
    console.log("事务失败")
  }

  request.onsuccess = function (event) {
    if (request.result) {
      console.log('name:' + request.result.name)
      console.log('age:' + request.result.age)
      console.log('email:' + request.result.email)
    } else {
      console.log('没有获取到数据')
    }
  }
}


// 遍历数据
function readAll() {
  var objectStore = db.transaction('person').objectStore('person')

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result
    if (cursor) {
      console.log('Id: ' + cursor.key);
      console.log('Name: ' + cursor.value.name);
      console.log('Age: ' + cursor.value.age);
      console.log('Email: ' + cursor.value.email)
      cusor.continue()
    } else {
      console.log('没有更多数据了！')
    }
  }
}
readAll()


// 更新数据
function update() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' })

  request.onsuccess = function (event) {
    console.log('数据更新成功')
  }
  request.onerror = function (event) {
    console.log('数据更新失败')
  }
}
update()


// 删除数据
function remove() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1)
  request.onsuccess = function (event) {
    console.log('数据删除成功');
  }
}
remove()


// 使用索引
objectStore.createIndex('name', 'name', { unique: false });

var transaction = db.transaction(['person'], 'readonly');
var store = transaction.objectStore('person');
var index = store.index('name');
var request = index.get('李四');

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}
