const a = [1,2,3],
b = function(x,y) {
    console.log(x);
    console.log('000')
    console.log(y);
}

b.call(this, a);

console.log('______')

b.apply(this,a);