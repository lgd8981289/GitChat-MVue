/**
 * 指令集和
 * 
 * v-model
 */
var directives = {

    /**
     * 分配指令
     */
    dir: function (vm, node, exp, dir) {
        this['_'+dir](vm, node, exp);
    },

    _bind: function (vm, exp, patchFn) {
        new Watcher(vm,exp, patchFn);
    },

    /**
     * 链接patch方法，将指令转化为真实的数据并展示
     */
    _link: function (vm, node, exp, dir) {
        var patchFn = patch(vm, node, exp, dir);
        patchFn  && patchFn(node, vm._getVal(exp));

        this._bind(vm, exp, function (value) {
            patchFn  && patchFn(node, value);
        });
    },

    /**
     * v-model事件处理
     */
    _model: function (vm, node, exp) {
        this._link(vm, node, exp, 'model');

        var val = vm._getVal(exp);
        node.addEventListener('input', function (e) {
            var newVal = e.target.value;
            if (newVal === val) return;
            vm._setVal(exp,newVal);
            val = newVal;
        });
    },

    /**
     * {{}}事件处理
     */
    _text: function (vm, node, exp) {
        this._link(vm, node, exp, 'text');
    },

    /**
     * isShow
     */
    _show: function (vm, node, exp) {
        this._link(vm, node, exp, 'show');
    },

    /**
     * v-on:click
     */
    _click: function (vm, node, exp) {
        var fn = vm.$options.methods && vm.$options.methods[exp.replace('()', '')];

        if (fn) {
            node.addEventListener('click', fn.bind(vm), false);
        }
    }
}