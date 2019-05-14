const intersect = (nums1, nums2) => {
    const map = {};
    const res = [];
    for (let n of nums1) {
        if (map[n]) {
            map[n]++
        } else {
            map[n] = 1
        }
    }
    // console.log(map);
    for (let n of nums2) {
        if (map[n] > 0) {
            res.push(n)
            map[n]--
        }
    }
    return res;
}

console.log(intersect([1,2,3], [1,4,6,1,2]))