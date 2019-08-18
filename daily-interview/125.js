const fn = arr => {
    const res = [];
    const map = arr.reduce((res, item) => ((res[item.id] = item), res), {});
    for (const item of Object.values(map)) {
        if (!item.pId) {
            res.push(item);
        } else {
            const parent = map[item.pId];
            parent.child = parent.child || [];
            parent.child.push(item);
        }
    }
    return res;
}