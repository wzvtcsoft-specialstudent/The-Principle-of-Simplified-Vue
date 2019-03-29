function Dep() {
    this.subs = [];
}
Dep.prototype = {
    /* 添加watcher函数 */
    addSub(sub) {
        this.subs.push(sub);
    },
    /* 通知更新函数 */
    notify() {
        this.subs.forEach( sub => sub.update());
    }
}
Dep.target = null;
var ComState = null;

/**
 * 
 * @param {json} data 写在实例上的数据 *.data: {x1:xxx,x2:xxx}
 */
function observe(data) {
    if(!data || typeof data !== 'object') return; // 如果data已经是末尾的属性了
    Object.keys(data).forEach( key => defineReactive(data, key, data[key])); //不为末尾，执行defineReactive函数
}

/**
 * 
 * @param {object} data 写在实例上的数据 *.data: {x1:xxx,x2:xxx}
 * @param {string} key 键名,属性名
 * @param {*} value 键值，属性值
 */
function defineReactive(data, key, value) {
    observe(value); // 递归遍历
    let dep = new Dep(); //消息订阅器,保存订阅者
    let deps = []; // 保存所有的计算属性回调
    Object.defineProperty(data, key, {
        enumerable: true, // 可遍历(for..of,for..in ...)
        configurable: true, // 可编辑
        get() {
            if(Dep.target) { // 如果是初始化的 watcher,则加入dep数组
                dep.addSub(Dep.target);
            }
            if(ComState) { // 如果是初始化的 compile,则加入deps数组
                deps.push(ComState);
            } 
            return value;
        },
        set(newValue) {
            // 值未发生改变，则不执行
            if(value === newValue) return;
            value = newValue;
            deps.forEach( func => func()); // 执行计算属性的回调函数，重新计算属性值
            dep.notify(); // 通知所有订阅者更新函数
        }
    })
}