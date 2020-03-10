

var arr = [1,2,3];
async function a(num){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(num * num);
        },1000);
    })
}
 
async function test(){
    arr.forEach(async x=>{
        const res = await a(x);
        console.log(res);
    })
}
 
test();

// 1s后 1-4-9都输出

