import { directives } from './directive.js';

export function Compile (vm, el) {
    this.$vm = vm;
    el = this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (!el) {
        return;
    }

    this._update(el);
};

Compile.prototype = {

    /**
     * Vue中使用vm._render先根据真实DOM创建了虚拟DOM，然后在vm._update把虚拟DOM转化为真实DOM并渲染,
     * 我们这里没有虚拟DOM，所以直接通过createElm方法创建一个fragment用以渲染
     */
    _update: function (el) {
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
    createElm: function (node) {
        var childNode = node.firstChild;
        if (childNode) {
            this.$fragment.appendChild(childNode);
            this.createElm(node);
        }
    },
    /**
     * 对DOM进行解析
     */
    compileElm: function (childNodes) {
        var reg = /\{\{(.*)\}\}/;
        if (!childNodes) {
            childNodes = this.$fragment.childNodes;
        }
        
        [].slice.call(childNodes).forEach(node => {
            if (node.childNodes.length > 0) {
                // 迭代所有的节点
                this.compileElm(node.childNodes);
            }

            // 获取elementNode节点
            if (this.isElementNode(node)) {
                if (reg.test(node.textContent)) {
                    // 匹配 {{*}}
                    this.compileTextNode(node, RegExp.$1);
                } 
                // 匹配elementNode
                this.compileElmNode(node);
                
            } 
        });
    },
    /**
     * 解析elementNode，获取elm的所有属性然后便利，检查属性是否属于已经注册的指令,
     * 如果不是我们的自定义指令，那么就不需要去处理它了
     * 如果是已注册的指令，我们就交给directive去处理。（演示只有一个v-model）
     */
    compileElmNode: function (node) {
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
    compileTextNode: function (node, exp) {
        directives.dir(this.$vm, node, exp, 'text');
    },
    /**
     * 判断是否是已注册的指令，这里就判断是否包含 v-
     */
    isDirective: function (attrNodeName) {
        return attrNodeName.indexOf('v-') === 0;
    },
    /**
     * 判断是否是事件指令
     */
    isEvent: function (dir) {
        return dir.indexOf('on') === 0;
    },
    /**
     * 判断elmNode节点
     */
    isElementNode: function (node) {
        return node.nodeType === 1;
    }
} 


