var uid = 0;


function Dep () {
    // 持有的watcher订阅者
    this.subs = [];
    this.id = uid++;
}

Dep.prototype = {
    // 使dep与watcher互相持有
    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    },

    addSub: function (sub) {
        this.subs.push(sub);
    },

    notify: function () {
        this.subs && this.subs.forEach(function (sub) {
            sub.update();
        });
    }
}