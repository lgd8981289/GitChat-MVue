import { Dep } from './dep.js';

export function Watcher (vm, expOrFn, patchFn) {
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
    /**
     * 更新
     */
    update: function () {
        this.run();
    },
    /**
     * 执行更新操作
     */
    run: function () {
        var oldVal = this.value;
        var newVal = this.get();
        if (oldVal === newVal) {
            return;
        }
        this.value = newVal;
        this.$patchFn.call(this.$vm, newVal);
    },
    /**
     * 订阅Dep
     */
    addDep: function (dep) {
        if (this.depIds.hasOwnProperty(dep.id)) {
            return;
        }
        dep.addSub(this);
        this.depIds[dep.id] = dep;
    },
    /**
     * 获取exp对应值，这时会激活observer中的get事件
     */
    get: function () {
        Dep.target = this;
        var value = this.getter.call(this.$vm, this.$vm._data);
        Dep.target = null;
        return value;
    },
    /**
     * 获取exp的对应值，应对a.b.c
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