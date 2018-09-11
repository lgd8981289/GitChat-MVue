<template>
    <div>
        <div class="chat-footer" @click="onTogglePop()">
            <div class="send-msg">
                想要发送的内容。。。
            </div>

            <div class="send-btn">
                <img src="../../static/img/more.png" alt="">
            </div>
        </div>

        <div class="send-msg-pop animated fast" :class="[togglePop ? 'slideInUp' : 'slideOutDown']" >
            <div class="chat-footer">
                <div class="send-msg">
                    想要发送的内容。。。
                </div>

                <div class="send-btn">
                    <img src="../assets/img/more.png" alt="" @click="onTogglePop()">
                </div>
            </div>
            <div>
                <ul>
                    <li v-for="(item, index) in rightDatas" :key="index" @click="onRightSelectMsg(item)">
                        {{item.rightMsg[0]}}
                    </li>
                </ul>
            </div>
        </div>

        <div class="pop-bg animated" :class="[togglePop ? 'fadeIn' : 'fadeOut']" @click="onTogglePop()"></div>
    </div>
</template>

<script>
export default {
    props: {
        // 是否正在输入
        inputDisable: {
            type: Boolean,
            required: true,
            default: true
        }, 
        //要说的话
        rightDatas: {
            type: Array,
            required: true,
            default: []
        }, 
    },
    data: function () {
        return {
            togglePop: false, // 展示浮层
        }
    },
    methods: {
        // 控制pop的显示和隐藏
        onTogglePop: function () {
            if (this.inputDisable) {
                return;
            }
            this.togglePop = !this.togglePop;
        },
        // 选择要说的话
        onRightSelectMsg: function (item) {
            this.$emit('onRightSelectMsg', item);
            this.togglePop = false;
        }
    }
}
</script>

<style scoped lang="less">
    .chat-footer {
        background: linear-gradient(to bottom, #f3f3f3, #e3e2e2);;
        height: 44px;
        position: absolute;
        bottom: 0;
        left: 0px;
        right: 0px;
        z-index: 90;
    }

    .send-msg {
        display: inline-block;
        width: 78%;
        height: 30px;
        border: 1px solid #ddd;
        border-radius: 6px;
        float: left;
        background-color: white;
        color: #bbb;
        margin: 6px 0 6px 4%;
        text-align: left;
        line-height: 30px;
        padding-left: 8px;
    }

    .send-btn {
        img {
        width: 32px;
        margin: 6px 18px 6px 0px;
        float: right;
        }
    }

    .send-msg-pop {
        z-index: 100;
        position: absolute;
        width: 100%;
        bottom: 0px;
        .chat-footer {
             position: relative;
            img {
                transform: rotate(45deg);
            }
        }

        ul {
            background-color: white; 
            padding: 0px;
            li {
                border-bottom: 1px solid rgba(187, 187, 187, 0.39);;
                min-height: 28px;
                line-height: 28px;
            }
        }
    }

    .pop-bg {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(43, 42, 42, 0.47);
    }

    .fast {
        -webkit-animation-duration: .2s;
        animation-duration: .2s;
    }
    
    .fadeIn {
        display: block;
    }

    .fadeOut {
        display: none;
    }
</style>
