var uid = 0;


function Dep () {
    // 持有的watcher订阅者
    this.subs = [];
    this.id = uid++;
}

Dep.prototype = {
    // 使dep与watcher互相持有
    depend () {
        // Dep.target为watcher实例
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    },
    // 添加watcher
    addSub: function (sub) {
        this.subs.push(sub);
    },
    // 通知所有的watcher进行更新
    notify: function () {
        this.subs && this.subs.forEach(function (sub) {
            sub.update();
        });
    }
}