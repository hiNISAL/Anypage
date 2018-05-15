<template>
  <div id="login">
    <div class="title">Any Page</div>

    <el-row>
      <el-col :span="19">
        <div>
          <el-input placeholder="key" v-model="key"></el-input>
        </div>
      </el-col>
      <el-col :span="5">
        <div>
          <el-button class="loginBtn" type="primary" @click="login"><i class="fa fa-angle-right"></i></el-button>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      key: ""
    };
  },
  methods: {
    warnning(text) {
      this.$notify({
        title: '提示',
        message: text,
        type: 'warning'
      });
    },
    async login() {
      try {
        const { data: { data, msg, status } } = await axios.post("/login", { key: this.key });

        if (status) {
          this.$router.push('/backstage');
          return;
        }
        this.warnning(msg);
      } catch (e) {}
    },
    async checkLogin() {
      try {
        const { status } = await axios.post('/login/check');

        if (status) {
          this.$router.push('/backstage');
          return;          
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted() {
    this.checkLogin();
  }
};
</script>

<style lang="scss" scoped>
#login {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 300px;
  padding: 30px;
  box-shadow: 0 0 15px #dfdfdf;
  transform: translate(-50%, -50%);
  border-top: 4px solid #2998ff;

  .title {
    text-align: center;
    padding-bottom: 20px;
  }

  .loginBtn {
    border-left: 0 none;
  }
}
</style>
