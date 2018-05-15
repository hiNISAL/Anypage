<template>
  <div id="sites">
    <div v-show="!sites.length" id="tips">
      <el-alert
        title="消息"
        type="warning"
        description="暂无站点"
        show-icon
        :closable="false">
      </el-alert>
    </div>
    <el-row>
      <el-col :span="7" v-for="(item, index) in sites" :key="item.route" :offset="index % 3 === 0 ? 0 : 1" style="margin-top: 30px; margin-bottom: 30px;">
        <el-card :body-style="{ padding: '0px'}">
          <img :src="item.cover" class="image">
          <div style="padding: 14px;">
            <span>{{ item.title }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.desc }}</time>
              <el-button type="text" class="button" @click="go(item.route)">访问</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div id="toLogin" @click="toLogin">
      <i class="el-icon-d-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      sites: []
    }
  },
  methods: {
    toLogin() {
      this.$router.push({ name: 'Login' })
    },
    async getSites() {
      try {
        const { data: { data, msg, status } } = await axios.get('/common/sites');

        if (!status) {
          this.warnning(msg);
          return;
        }

        if (data.length === 0) {
          this.warnning('没有数据');
          return;
        }

        this.sites = data.sites;
      } catch(e) {
        this.warnning('加载失败');
      }
    },
    go(route) {
      location.href = route;
    },
    warnning(text) {
      this.$notify({
        title: '提示',
        message: text,
        type: 'warning'
      });
    }
  },
  mounted() {
    this.getSites();
  }
}
</script>

<style lang="scss" scoped>
  #sites {
    width: 1200px;
    margin: 0 auto;
    .time {
      font-size: 13px;
      color: #999;
    }
    
    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }

    .button {
      padding: 0;
      float: right;
    }

    .image {
      width: 100%;
      height: 300px;
      display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }

    #tips {
      position: fixed;
      width: 200px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    #toLogin {
      position: fixed;
      right: 40px;
      bottom: 50px;
      line-height: 50px;
      width: 50px;
      background: #48b5e7;
      border-radius: 50%;
      text-align: center;
      color: white;
      font-size: 20px;
      cursor: pointer;

      &:active {
        background: #1c84b4;
      }
    }
  }
</style>
