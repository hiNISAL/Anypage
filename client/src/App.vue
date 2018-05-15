<template>
  <div id="app">
    <transition name="el-fade-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  html {
    font-size: 16px;    
  }
  button, input{
    border-radius: 0 !important;
  }
</style>
