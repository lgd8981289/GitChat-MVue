
function Watcher (vm, expOrFn, patchFn) {
    this.depIds = {};
    this.$patchFn = patchFn;
    this.$vm = vm;

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
      } else {
        this.getter = this.parsePath(expOrFn)
      }

    this.value = this.get();
}

Watcher.prototype = {
    update: function () {
        this.run();
    },

    run: function () {
        var oldVal = this.value;
        var newVal = this.get();
        if (oldVal === newVal) {
            return;
        }
        this.value = newVal;
        this.$patchFn.call(this.$vm, newVal);
    },

    addDep: function (dep) {
        if (this.depIds.hasOwnProperty(dep.id)) {
            return;
        }
        dep.addSub(this);
        this.depIds[dep.id] = dep;
    },
    get: function () {
        Dep.target = this;
        var value = this.getter.call(this.$vm, this.$vm._data);
        Dep.target = null;
        return value;
    },
    /**
     * 获取exp的对应值
     */
    parsePath: function (path) {
        var segments = path.split('.');

        return function (obj) {
          for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
          }
          return obj
        }
      }
}