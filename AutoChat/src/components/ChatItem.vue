<template>
    <div :class="[chatItemObj.type === 'left' ? 'left fadeInLeft' : 'right fadeInRight']" class="animated">
        <img class="avater" :src="[chatItemObj.type === 'left' ? require('../assets/img/avatar-left.jpg') : require('../assets/img/avatar-right.jpg')]" alt="">
        <p class="msg">{{chatItemObj.msg}}</p>
    </div>
</template>

<script>
export default {
    props: {
        chatItemObj: {
            type: Object,
            required: true,
            default: {}
        }
    }
}
</script>

<style scoped lang="less">

    @right-msg-bg: #05c10a;

    .left {
        width: 100%;
        float: left;
        margin-top: 12px;
        .avater {
            height: 44px;
            border-radius: 22px;
            vertical-align:top;
        }

        .msg {
            background-color: white;
            padding: 8px 14px;
            border-radius: 8px;
            display: inline-block;
            max-width: 66%;
        }
    }

  .right {
    width: 100%;
    float: right;
    margin-top: 12px;
    .avater {
      height: 44px;
      border-radius: 22px;
      float: right;
    }

    .msg {
      background-color: @right-msg-bg;
      color: white;
      padding: 8px 14px;
      border-radius: 8px;
      float: right;
      margin-right: 4px;
      max-width: 66%;
    }
  }
</style>
