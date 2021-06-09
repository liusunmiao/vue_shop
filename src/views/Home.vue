<template>
  <div class="home">
    <el-button type="info" v-on:click="loginout">退出</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  methods: {
    // 退出登录
    loginout () {
      // 清空缓存
      window.sessionStorage.clear()
      // 跳转到登录也
      this.$router.push('/login')
    }
  }
}
</script>
