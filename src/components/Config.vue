<template>
  <div class="decrease" >
    <div class="app">
      <img src="../assets/logo.png">
    </div>
      <el-input type="text" placeholder="请输入Token" style="width: 500px" prefix-icon="el-icon-view" v-model="token" ></el-input>
      <el-button type="primary" @click="saveToken" >保存</el-button>
      <div style="margin: 20px 0;"></div>
      <el-input type="text" placeholder="请输入本地zerotierOne baseUrl 无特殊情况使用默认值" style="width: 500px" suffix-icon="el-icon-warning-outline" v-model="baseUrl" >
        <template slot="prepend">http://</template>
      </el-input>
      <el-button type="primary" @click="saveServerBaseUrl" >保存</el-button>
      <div style="margin: 20px 0;"></div>
      <el-input type="text" placeholder="请输入本地zerotierOne token" style="width: 500px" v-model="serverToken" >
      </el-input>
      <el-button type="primary" @click="saveServerToken" >保存</el-button>
      <div style="margin: 20px 0;"></div>
    <el-button type="info" @click="open" round>如何获取zerotierOne token</el-button>
    <el-button type="success" @click="auto" round>自动填入</el-button>
<!--    <el-popover-->
<!--      placement="bottom"-->
<!--      title="如何获取zerotierOne token"-->
<!--      width="400"-->
<!--      trigger="click"-->
<!--      :content="content"-->
<!--                >-->
<!--      <el-button type="info" slot="reference" round>如何获取zerotierOne token</el-button>-->
<!--    </el-popover>-->
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
      baseUrl: '',
      serverToken: '',
      configPath: {
        windowsConfig: '\\ProgramData\\ZeroTier\\One\\authtoken.secret',
        linuxConfig: '/var/lib/zerotier-one/authtoken.secret',
        macConfig: '~/Library/Application Support/ZeroTier/authtoken.secret'
      },

      content: '<strong><h4>在以下目录中寻找authtoken.secret文件:</h4><ul><li>Mac :: ~/Library/Application Support/ZeroTier</li> <li>Windows :: \\ProgramData\\ZeroTier\\One</li> <li>Linux :: /var/lib/zerotier-one</li></ul></strong>',
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.token = this.getToken()
    this.baseUrl = this.getServerBaseUrl() === '' ? 'localhost:9993/' : this.getServerBaseUrl()
    this.serverToken = this.getServerToken()
  },
  methods: {
    open () {
      this.$alert(this.content, '如何获取zerotierOne token', {
        dangerouslyUseHTMLString: true
      })
    },
    auto () {
      let filePath = ''
      // eslint-disable-next-line no-undef
      if (utools.isWindows()) {
        filePath = this.configPath.windowsConfig
        // eslint-disable-next-line no-undef
      } if (utools.isLinux()) {
        filePath = this.configPath.linuxConfig
        // eslint-disable-next-line no-undef
      } else if (utools.isMacOs()) {
        filePath = this.configPath.macConfig
      }
      const sss = window.readServerToken(filePath)
      console.log('文件中的serverToken:' + String(sss))
      if (sss !== '' || sss.length !== 0) {
        this.serverToken = String(sss)
        this.success('配置文件读取成功')
      } else {
        this.error('配置文件获取失败，检查权限或手动输入')
      }
    },
    saveServerBaseUrl () {
      if (!this.baseUrl.endsWith('/')) {
        this.baseUrl = this.baseUrl + '/'
      }
      // eslint-disable-next-line no-undef
      utools.dbStorage.setItem('zeroTier_server_baseUrl', 'http://' + this.baseUrl)
      console.log('保存成功')
      this.success('保存成功')
    },
    saveServerToken () {
      // eslint-disable-next-line no-undef
      utools.dbStorage.setItem('zeroTier_server_token', this.serverToken)
      console.log('保存成功')
      this.success('保存成功')
    },
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
    getServerBaseUrl () {
      // eslint-disable-next-line no-undef
      const serverBaseUrl = utools.dbStorage.getItem('zeroTier_server_baseUrl')
      console.log(serverBaseUrl)
      if (serverBaseUrl !== '' && serverBaseUrl !== null) {
        return serverBaseUrl
      } else {
        console.log('不存在ServerBaseUrl')
        return ''
        // this.info('还未配置token')
      }
    },
    getServerToken () {
      // eslint-disable-next-line no-undef
      const serverToken = utools.dbStorage.getItem('zeroTier_server_token')
      console.log(serverToken)
      if (serverToken !== '' && serverToken !== null) {
        return serverToken
      } else {
        console.log('不存在ServerToken')
        // this.info('还未配置token')
        return ''
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
  .app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 8px;
  }
</style>
