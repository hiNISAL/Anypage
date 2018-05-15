<template>
  <div id="backstage">
    <nav>
      <el-menu :default-active="active" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="-1" @click="to('Sites')"><div class="title">Any Page</div></el-menu-item>
        <el-menu-item index="1" @click="to('Upload')">添加站点</el-menu-item>
        <el-menu-item index="2" @click="to('Management')">站点管理</el-menu-item>
      </el-menu>
    </nav>
    <div id="container">
      <transition name="el-fade-in" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: '1'
    }
  },
  methods: {
    to(name) {
      this.$router.push({ name })
    }
  },
  mounted() {
    this.active = this.$route.name === 'Upload' ? '1' : '2';
  }
}
</script>

<style lang="scss" scoped>
  #backstage {
    padding-top: 92px;
    nav {
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 10;

      .title {
        font-size: 1.4rem;
        color: #2998ff;
      }
    }

    #container {
      width: 1200px;
      margin: 0 auto;
      margin-bottom: 50px;
    }
  }
</style>
