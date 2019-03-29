/**
 * 
 * @param {Object} obj 绑定计算属性的属性
 * @param {string} key 键名，属性名
 * @param {function} comFunc 计算属性的计算函数
 */
function Computed(obj, key, comFunc) {
    // 绑定调用函数的对象(需优化)
    comFUnc = comFunc.bind(sv.data); 
    /* 更新视图函数 */
    ComState = function() {
        value = comFunc();
        sv.data.say = value; // 更新内容(触发Observe的set() => Watcher的回调函数)
    };
    let value = comFunc(); // 初始化计算结果
    sv.data.say = value; // 初始化 
    ComState = null; // 加入deps数组成功后释放
}