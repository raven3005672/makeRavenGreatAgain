const model = document.getElementById('model');
const word = document.getElementById('word');
var obj = {};

const newObj = new Proxy(obj, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
        console.log('setting', target, key, value, receiver);
        if (key === "text") {
            model.value = value;
            word.innerHTML = value;
        }
        return Reflect.set(target, key, value, receiver);
    }
});
model.addEventListener('keyup', function(e) {
    newObj.text = e.target.value;
});