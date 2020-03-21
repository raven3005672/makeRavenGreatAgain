

var arr = [1,2,3];
function a(num){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(num * num);
        },1000);
    })
}

async function test() {
    // 延迟输出1---4---9
    for (key of arr) {
        const res = await a(key);
        console.log(res)
    }
    // 一起输出149
    // arr.forEach(x => {
    //     const res = await a(x);
    //     console.log(res);
    // })
}
 
test();


