import { Compile } from './compile.js';
import { observer } from './observer.js';

function MVue (options) {
    var vm = this;
    this.$options = options;
    var data = this._data = options.data || {};

    // data代理，让我们可以直接通过 this.msg 获取到 this._data.msg的内容
    Object.keys(data).forEach(function(key) {
        vm._proxyData(key);
    });

    observer(data);

    new Compile(this, this.$options.el);
}

MVue.prototype = {
    _proxyData: function(key) {
        var vm = this;
        Object.defineProperty(vm, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                return vm._data[key];
            },
            set: function (newVal) {
                vm._data[key] = newVal;
            }
        });
    },

    _getVal: function (exp) {
        return this._data[exp];
    },

    _setVal: function (exp, newVal) {
        this._data[exp] = newVal;
    }
};

export default MVue;