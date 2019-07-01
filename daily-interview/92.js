const data = [{
    id: '1',
    name: 'test1',
    children: [
        {
            id: '11',
            name: 'test11',
            children: [
                {
                    id: '111',
                    name: 'test111'
                },
                {
                    id: '112',
                    name: 'test112'
                }
            ]
        },
        {
            id: '12',
            name: 'test12',
            children: [
                {
                    id: '121',
                    name: 'test121'
                },
                {
                    id: '122',
                    name: 'test122'
                }
            ]
        }
    ]
}];

function findRoot(data, value) {
    let res = [];
    const dfs = (arr, temp = []) => {
        for (const node of arr) {
            if (node.children) {
                dfs(node.children, temp.concat(node.id));
            } else {
                if (node.id === value) {
                    res = temp.concat(node.id);
                }
                return true;
            }
        }
    }
    dfs(data);
    return res;
}

console.log(findRoot(data, '111'))

