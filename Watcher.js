/**
 * 
 * @param {上下文环境this} vm 指向入口函数 SelfVue 的作用域
 * @param {string} key 键名,属性名
 * @param {function} callBack 更新视图的回调函数
 */
function Watcher(vm, key, callBack, upviewcb) {
    this.vm = vm; // 绑定作用域,指向 selfvue 的作用域
    this.key = key; // 绑定键名
    this.cb = callBack; // 绑定回调函数
    this.upviewcb = upviewcb;
    this.value = this.get(); //获取值
}

Watcher.prototype = {
    /* 更新时触发的函数 */
    update() {
        this.run();
    },
    /* 更新视图数据的函数 */
    run() {
        if (typeof this.upviewcb === "undefined") {
            this.cb.call(this.vm, this.vm[this.key]);
        } else {
            let value = this.cb(); // 获取新值
            let oldValue = this.value; // 获取旧值
            if (value === oldValue) return; // 值未发生改变
            this.value = value; // 更新旧值
            this.upviewcb.call(this.vm, value); //执行视图更新函数
        }
    },
    get() {
        // 执行observe的get(),使得watcher添加入deps数组中
        if(typeof this.upviewcb === "undefined") {
            Dep.target = this; // 绑定自身
            this.vm[this.key];
            Dep.target = null; // 添加deps数组成功后释放
        } else {
            dep.addSub(this);
            return this.cb();
        }
    }
}