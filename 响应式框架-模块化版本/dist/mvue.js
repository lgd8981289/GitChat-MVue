(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.MVue = factory());
}(this, (function () { 'use strict';

    /**
     * 更改node value，在编译之前，替换 v-model  {{*}} 为真实数据
     * @param {*} vm 
     * @param {*} node 
     * @param {*} exp 
     * @param {*} dir 
     */
    function patch(vm, node, exp, dir) {

        switch (dir) {
            case 'model':
                /**
                 * input / textear
                 */
                return function (node, val) {
                    node.value = typeof val === 'undefined' ? '' : val;
                };
            case 'text':
                /**
                 * {{*}}
                 */
                return function (node, val) {
                    node.textContent = typeof val === 'undefined' ? '' : val;
                };
            case 'show':
                /**
                 * {{*}}
                 */
                return function (node, val) {

                    if (node._originalDisplay === undefined) {
                        node._originalDisplay = node.style.display;
                    }

                    val ? node.style.display = node._originalDisplay : node.style.display = 'none';
                };
        }
    }

    var uid = 0;

    function Dep() {
        // 持有的watcher订阅者
        this.subs = [];
        this.id = uid++;
    }

    Dep.prototype = {
        // 使dep与watcher互相持有
        depend: function depend() {
            // Dep.target为watcher实例
            if (Dep.target) {
                Dep.target.addDep(this);
            }
        },

        // 添加watcher
        addSub: function addSub(sub) {
            this.subs.push(sub);
        },
        // 通知所有的watcher进行更新
        notify: function notify() {
            this.subs && this.subs.forEach(function (sub) {
                sub.update();
            });
        }
    };

    function Watcher(vm, expOrFn, patchFn) {
        this.depIds = {};
        this.$patchFn = patchFn;
        this.$vm = vm;

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parsePath(expOrFn);
        }

        this.value = this.get();
    }

    Watcher.prototype = {
        /**
         * 更新
         */
        update: function update() {
            this.run();
        },
        /**
         * 执行更新操作
         */
        run: function run() {
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
        addDep: function addDep(dep) {
            if (this.depIds.hasOwnProperty(dep.id)) {
                return;
            }
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        },
        /**
         * 获取exp对应值，这时会激活observer中的get事件
         */
        get: function get() {
            Dep.target = this;
            var value = this.getter.call(this.$vm, this.$vm._data);
            Dep.target = null;
            return value;
        },
        /**
         * 获取exp的对应值，应对a.b.c
         */
        parsePath: function parsePath(path) {
            var segments = path.split('.');

            return function (obj) {
                for (var i = 0; i < segments.length; i++) {
                    if (!obj) return;
                    obj = obj[segments[i]];
                }
                return obj;
            };
        }
    };

    /**
     * 指令集和
     * 
     * v-model
     */
    var directives = {

        /**
         * 分配指令
         */
        dir: function dir(vm, node, exp, _dir) {
            this['_' + _dir](vm, node, exp);
        },

        _bind: function _bind(vm, exp, patchFn) {
            new Watcher(vm, exp, patchFn);
        },

        /**
         * 链接patch方法，将指令转化为真实的数据并展示
         */
        _link: function _link(vm, node, exp, dir) {
            var patchFn = patch(vm, node, exp, dir);
            patchFn && patchFn(node, vm._getVal(exp));

            this._bind(vm, exp, function (value) {
                patchFn && patchFn(node, value);
            });
        },

        /**
         * v-model事件处理
         */
        _model: function _model(vm, node, exp) {
            this._link(vm, node, exp, 'model');

            var val = vm._getVal(exp);
            node.addEventListener('input', function (e) {
                var newVal = e.target.value;
                if (newVal === val) return;
                vm._setVal(exp, newVal);
                val = newVal;
            });
        },

        /**
         * {{}}事件处理
         */
        _text: function _text(vm, node, exp) {
            this._link(vm, node, exp, 'text');
        },

        /**
         * isShow
         */
        _show: function _show(vm, node, exp) {
            this._link(vm, node, exp, 'show');
        },

        /**
         * v-on:click
         */
        _click: function _click(vm, node, exp) {
            var fn = vm.$options.methods && vm.$options.methods[exp.replace('()', '')];

            if (fn) {
                node.addEventListener('click', fn.bind(vm), false);
            }
        }
    };

    function Compile(vm, el) {
        this.$vm = vm;
        el = this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (!el) {
            return;
        }

        this._update(el);
    }
    Compile.prototype = {

        /**
         * Vue中使用vm._render先根据真实DOM创建了虚拟DOM，然后在vm._update把虚拟DOM转化为真实DOM并渲染,
         * 我们这里没有虚拟DOM，所以直接通过createElm方法创建一个fragment用以渲染
         */
        _update: function _update(el) {
            this.$fragment = document.createDocumentFragment();
            // 复制el的内容到创建的fragment
            this.createElm(el);
            // 解析被创建完成的fragment，此时fragment已经拥有了el内所有的元素
            this.compileElm();
            // 把解析之后的fragment放入el中，此时fragment中的所有指令已经被解析为具体数据
            el.appendChild(this.$fragment);
        },

        /**
         * 创建新的DOM 用来替换 原DOM
         */
        createElm: function createElm(node) {
            var childNode = node.firstChild;
            if (childNode) {
                this.$fragment.appendChild(childNode);
                this.createElm(node);
            }
        },
        /**
         * 对DOM进行解析
         */
        compileElm: function compileElm(childNodes) {
            var _this = this;

            var reg = /\{\{(.*)\}\}/;
            if (!childNodes) {
                childNodes = this.$fragment.childNodes;
            }

            [].slice.call(childNodes).forEach(function (node) {
                if (node.childNodes.length > 0) {
                    // 迭代所有的节点
                    _this.compileElm(node.childNodes);
                }

                // 获取elementNode节点
                if (_this.isElementNode(node)) {
                    if (reg.test(node.textContent)) {
                        // 匹配 {{*}}
                        _this.compileTextNode(node, RegExp.$1);
                    }
                    // 匹配elementNode
                    _this.compileElmNode(node);
                }
            });
        },
        /**
         * 解析elementNode，获取elm的所有属性然后便利，检查属性是否属于已经注册的指令,
         * 如果不是我们的自定义指令，那么就不需要去处理它了
         * 如果是已注册的指令，我们就交给directive去处理。（演示只有一个v-model）
         */
        compileElmNode: function compileElmNode(node) {
            var attrs = [].slice.call(node.attributes),
                $this = this;

            attrs.forEach(function (attr) {
                if (!$this.isDirective(attr.nodeName)) {
                    return;
                }

                var exp = attr.value;
                var dir = attr.nodeName.substring(2);

                // 匹配指令
                if ($this.isEvent(dir)) {
                    dir = dir.substring(3);
                }
                directives.dir($this.$vm, node, exp, dir);
                node.removeAttribute(attr.name);
            });
        },
        /**
         * 解析{{*}}
         */
        compileTextNode: function compileTextNode(node, exp) {
            directives.dir(this.$vm, node, exp, 'text');
        },
        /**
         * 判断是否是已注册的指令，这里就判断是否包含 v-
         */
        isDirective: function isDirective(attrNodeName) {
            return attrNodeName.indexOf('v-') === 0;
        },
        /**
         * 判断是否是事件指令
         */
        isEvent: function isEvent(dir) {
            return dir.indexOf('on') === 0;
        },
        /**
         * 判断elmNode节点
         */
        isElementNode: function isElementNode(node) {
            return node.nodeType === 1;
        }
    };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function observer(value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
            return;
        }

        var ob = new Observer(value);
    }

    function Observer(data) {
        this.data = data;
        this.walk();
    }

    Observer.prototype = {

        walk: function walk() {
            var $this = this;
            var keys = Object.keys(this.data);
            keys.forEach(function (key) {
                $this.defineReactive(key, $this.data[key]);
            });
        },

        defineReactive: function defineReactive(key, value) {
            var dep = new Dep();
            Object.defineProperty(this.data, key, {
                enumerable: true,
                configurable: true,
                set: function set$$1(newValue) {
                    if (value === newValue) {
                        return;
                    }

                    value = newValue;
                    dep.notify();
                },

                get: function get$$1() {
                    dep.depend();
                    return value;
                }
            });
        }

    };

    function MVue(options) {
        var vm = this;
        this.$options = options;
        var data = this._data = options.data || {};

        // data代理，让我们可以直接通过 this.msg 获取到 this._data.msg的内容
        Object.keys(data).forEach(function (key) {
            vm._proxyData(key);
        });

        observer(data);

        new Compile(this, this.$options.el);
    }

    MVue.prototype = {
        _proxyData: function _proxyData(key) {
            var vm = this;
            Object.defineProperty(vm, key, {
                configurable: true,
                enumerable: true,
                get: function get() {
                    return vm._data[key];
                },
                set: function set(newVal) {
                    vm._data[key] = newVal;
                }
            });
        },

        _getVal: function _getVal(exp) {
            return this._data[exp];
        },

        _setVal: function _setVal(exp, newVal) {
            this._data[exp] = newVal;
        }
    };

    return MVue;

})));
