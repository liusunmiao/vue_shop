<template>
  <div class='login_container'>
    <div class='login_box'>
      <!-- 头像区域 -->
      <div class='avatar_box'>
        <img src='../assets/logo.png' alt=''>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref='loginFormRef' label-width='0px' class='login_form' :model='loginForm' :rules='loginFormRules'
               rel='loginFormRef'>
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input prefix-icon='iconfont icon-user' v-model='loginForm.username'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input prefix-icon='iconfont icon-3702mima' type='password' v-model='loginForm.password'></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class='btns'>
          <el-button type='primary' v-on:click='login'>登录</el-button>
          <el-button type='info' v-on:click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 表单的验证规则
      loginFormRules: {
        // 校验用户名是否合法
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blue'
          },
          {
            min: 3,
            max: 10,
            message: '长度在3到10个字符',
            trigger: 'blur'
          }
        ],
        // 校验密码
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在6到15个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮 重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login () {
      this.$refs.loginFormRef.validate(async function(valid) {
        console.log(valid)
        if (!valid) {
          return
        }
        // 登录请求
        const { data: res } = await axios.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('登录失败')
          return
        }
        console.log('登录成功')
        this.$message.success('登录成功')
        // 保存登录的token
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转到home页面
        await this.$router.push('/home')
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
