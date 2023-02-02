<template>
  <div class="decrease" >
    <el-input type="text" placeholder="请输入Token" style="width: 500px" prefix-icon="el-icon-view" v-model="token" ></el-input>
    <el-button type="primary" @click="saveToken" >保存</el-button>
    <el-divider></el-divider>
    <el-col>
      <router-link to="/">
        <el-button>去首页</el-button>
      </router-link>
    </el-col>
  </div>
</template>
<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Token'))
      }
    }
    return {
      token: '',
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.token = this.getToken()
  },
  methods: {
    saveToken () {
      // eslint-disable-next-line no-undef
      utools.dbStorage.setItem('zeroTier_token', this.token)
      console.log('保存成功')
      this.success('保存成功')
    },
    removeToken () {
      // eslint-disable-next-line no-undef
      utools.dbStorage.removeItem('zeroTier_token')
      console.log('删除成功')
      this.success('删除成功')
    },
    getToken () {
      // eslint-disable-next-line no-undef
      const token = utools.dbStorage.getItem('zeroTier_token')
      console.log(token)
      if (token !== '' && token !== null) {
        return token
      } else {
        console.log('不存在token')
        this.info('还未配置token')
      }
    },
    success (message) {
      this.$notify({
        title: '成功',
        message: message,
        type: 'success'
      })
    },
    warning (message) {
      this.$notify({
        title: '警告',
        message: message,
        type: 'warning'
      })
    },
    info (message) {
      this.$notify.info({
        title: '消息',
        message: message
      })
    },
    error (message) {
      this.$notify.error({
        title: '错误',
        message: message
      })
    }
  }
}
</script>
<style>

</style>
