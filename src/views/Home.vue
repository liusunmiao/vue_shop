<template>
  <el-container class='home-container'>
    <!--    头部区域-->
    <el-header>
      <div>
        <img src='../assets/heima.png' alt=''>
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' v-on:click='loginout'>退出</el-button>
    </el-header>
    <!--    页面主体区域-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width='isCollapse?"64px":"200px"'>
        <!--        侧边栏侧边区域-->
        <div class='toggle-button' v-on:click='toggleCollapse'>
          |||
        </div>
        <!--        开启路由模式  :router='true'-->
        <el-menu
          :default-active='activePath'
          :router='true'
          :collapse-transition='false'
          :collapse='isCollapse'
          :unique-opened='true'
          background-color='#333744'
          text-color='#fff'
          active-text-color='#409efe'>
          <!--          一级菜单-->
          <el-submenu v-for='(item) in menuList' :key='item.id' :index="item.id+''">
            <!--            一级菜单模板区域-->
            <template slot='title'>
              <i :class='iconsObj[item.id]'></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--              二级菜单-->
            <el-menu-item v-for='(child) in item.children' :key='child.id' :index='"/"+child.path'
                          v-on:click='saveNavState("/"+child.path)'>
              <i class='el-icon-menu'></i>
              <span>{{ child.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      右侧内容主体-->
      <el-main>
        <!--        路由占位符-->
        <router-view>

        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Home',
  created () {
    // created生命周期在页面创建的时候调用
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    // 退出登录
    loginout () {
      // 清空缓存
      window.sessionStorage.clear()
      // 跳转到登录也
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await axios.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg())
      this.menuList = res.data
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header div span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
