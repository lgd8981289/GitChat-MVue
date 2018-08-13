function observer (value) {
    if (typeof value !== 'object') {
        return;
    }

    var ob = new Observer(value);
}


function Observer (data) {
    this.data = data;
    this.walk();
}

Observer.prototype = {

    walk: function () {
        var $this = this;
        var keys = Object.keys(this.data);
        keys.forEach(function (key) {
            $this.defineReactive(key, $this.data[key]);
        });
    },

    defineReactive: function (key, value) {
        var dep = new Dep();
        Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,
            set: function (newValue) {
                if (value === newValue) {
                    return;
                }
                value = newValue;
                dep.notify();
            },

            get: function () {
                dep.depend();
                return value;
            }
        });
    },



}