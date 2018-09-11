<template>
  <div>
    <div class="navbar">
      <span class="navbar-text">{{title}}</span>
    </div>

    <div class="content">
      <div>
        <ul  class="message-content" ref="messageContent">
          <li v-for="(item, index) in showMsgDatas" :key="index">
            <chat-item :chatItemObj="item"></chat-item>
          </li>
        </ul>
      </div>

      <chat-feature :inputDisable="inputDisable" :rightDatas="rightDatas" @onRightSelectMsg="onRightSelectMsg"></chat-feature>

    </div>
  </div>
  
  
</template>

<script>
import ChatItem from '../components/ChatItem.vue';
import ChatFeature from '../components/ChatFeature.vue';
export default {
  components: {
    'chat-item': ChatItem,
    'chat-feature': ChatFeature
  },
  data: function () {
    return {
      title: '和LGD_Sunday聊天中...',
      inputDisable: true, // 是否正在输入
      chatDatas: [], // 所有的聊天数据
      selectMsgData: {}, // 选中的聊天数据
      showMsgDatas: [], //展示出的聊天数据
      rightDatas: [], //要说的话
    }
  },
  created: function () {
    this.loadChatData();
  },
  methods: {
    scrollContent: function () {
      this.$nextTick(function () {
        var msgContent = this.$refs.messageContent;
        msgContent.scrollTop = msgContent.scrollHeight;
      })
    },
    // 获取聊天数据
    loadChatData: function () {
      var $this = this;
      this.$http.get('../../static/chatData.json')
        .then(function (res) {
          $this.chatDatas = res.data.msgData;
          $this.setMsg('001');
        });
    },
    // 自动对话
    setMsg: function (selectId) {
      this.selectMsgData = this.chatDatas.filter( (item) => {
        return item.id === selectId;
      })[0];
      this.setShowMsgDatas(this.selectMsgData.leftMsg, 'left');

      this.rightDatas = this.selectMsgData.rightData;
    },
    // 设置展示数据
    setShowMsgDatas: function (msgData, type) {
      var  $this = this;
      var i = 0;
      if ('left' === type) {
        $this.title = 'LGD_Sunday正在输入...';
        $this.inputDisable = true;
        var interval = setInterval(function () {
          $this.showMsgDatas.push({
            id: $this.selectMsgData.id,
            msg: msgData[i],
            type: type
          });
          $this.scrollContent();
          i++;

          if (i >= msgData.length) {
            $this.title = '和LGD_Sunday聊天中';
            $this.inputDisable = false;
            window.clearInterval(interval);
            return;
          }
        }, 1000);
      } else {
        this.showMsgDatas.push({
            id: $this.selectMsgData.id,
            msg: msgData[0],
            type: type
          });
        $this.scrollContent();
      }
    },
    // 选择要说的话
    onRightSelectMsg: function (item) {
      this.setShowMsgDatas(item.rightMsg, 'right');
      this.setMsg(item.id);
    }
  },
}
</script>

<style scoped lang="less">

  .navbar {
    height: 44px;
    display: flex;
  }

  .navbar-text {
    margin: 0 auto;
    line-height: 44px;
  }


  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 0;
    right: 0;
    left: 0;
    background: linear-gradient(to bottom, #57b1ff, #c0e2ff);
  }

  .message-content {
    position: absolute;
    top: 0;
    bottom: 45px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .animated {
      -webkit-animation-duration: .4s;
      animation-duration: .4s;
  }


</style>
