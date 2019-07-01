// 以下数据结构中，id代表部门编号，name是部门名称，parentId是父部门编号，为0代表一级部门
// 现在要求实现一个convert方法，把原始list转换成树形结构，parentId为多少就挂载在该id的属性children数组下
let list = [
    {id:1,name:'部门A',parentId:0},
    {id:2,name:'部门B',parentId:0},
    {id:3,name:'部门C',parentId:1},
    {id:4,name:'部门D',parentId:1},
    {id:5,name:'部门E',parentId:2},
    {id:6,name:'部门F',parentId:3},
    {id:7,name:'部门G',parentId:2},
    {id:8,name:'部门H',parentId:4}
];
// 转换后的结果如下
// let result = [
//     {
//       id: 1,
//       name: '部门A',
//       parentId: 0,
//       children: [
//         {
//           id: 3,
//           name: '部门C',
//           parentId: 1,
//           children: [
//             {
//               id: 6,
//               name: '部门F',
//               parentId: 3
//             }, {
//               id: 16,
//               name: '部门L',
//               parentId: 3
//             }
//           ]
//         },
//         {
//           id: 4,
//           name: '部门D',
//           parentId: 1,
//           children: [
//             {
//               id: 8,
//               name: '部门H',
//               parentId: 4
//             }
//           ]
//         }
//       ]
//     },
// //   ···
// ];

// 参考方法
function convert(list) {
	const res = []
	const map = list.reduce((res, v) => (res[v.id] = v, res), {})
	for (const item of list) {
		if (item.parentId === 0) {
			res.push(item)
			continue
		}
		if (item.parentId in map) {
			const parent = map[item.parentId]
			parent.children = parent.children || []
            parent.children.push(item)
            console.log('parent', parent)
        }
        console.log('res', res)
	}
	return res
}

const result = convert(list);
console.log(result)

