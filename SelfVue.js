/**
 * 
 * @param {Object} object 需要绑定的数据
 */
function SelfVue(object) {
    this.vm = this; // 绑定自身作用域
    this.data = object.data; // 绑定数据
    this.methods = object.methods; //绑定方法
    this.computed = object.computed; //绑定计算属性
    // 属性访问代理,使得 实例.属性名 = 实例.data.属性名
    Object.keys(this.data).forEach( key => this.proxykeys(key));
    observe(this.data); // 遍历数据，是每个属性为响应式
    new Compile(object.el, this.vm); //绑定页面DOM元素，并且解析指令
    computed(object.computed, this.vm);
    return this;
}

SelfVue.prototype = {
    /* 属性访问代理 */
    proxykeys(key) {
        Object.defineProperty(this, key, {
            enumerable: false, // 不可被遍历
            configurable: true, // 可修改
            get() {
                // 此get()，只在页面初始化时调用
                return this.data[key];
            },
            set(newValue) {
                // 实现属性访问代理
                this.data[key] = newValue;
            }
        })
    }
}