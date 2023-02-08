<template>
  <el-container>
<!--    <el-header>-->
<!--      <div class="demo-basic&#45;&#45;circle">-->
<!--        <div class="block" >-->
<!--&lt;!&ndash;          <el-avatar size="large" src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'></el-avatar>&ndash;&gt;-->
<!--        </div>-->
<!--        <router-link to="/config">-->
<!--          <el-button>-->
<!--            去配置页面-->
<!--          </el-button>-->
<!--        </router-link>-->
<!--      </div>-->
<!--    </el-header>-->
    <el-main>
      <el-collapse @change="handleChange" accordion>
        <div slot="header">
          <span>卡片名称</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <el-collapse-item :index="String(index)" v-for="(client,index) in sourceNetWork" :key="index" :name="index">
          <template slot="title">
            {{client.config.name}} <i class="el-icon--right el-icon-s-platform"></i>
          </template>
          <el-table :data="memberData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="auto">
                  <el-form-item label="id："><span>{{ props.row.id }}</span></el-form-item>
                  <el-form-item label="设备名称："><span>{{ props.row.name }}</span></el-form-item>
                  <el-form-item label="设备描述："><span>{{ props.row.description }}</span></el-form-item>
                  <el-form-item label="设备类型："><span>{{ props.row.type }}</span></el-form-item>
                  <el-form-item label="ip："><span>{{ props.row.config.ipAssignments }}</span></el-form-item>
                  <el-form-item label="版本："><span>{{ props.row.config.revision }}</span></el-form-item>
                  <el-form-item label="hidden："><span>{{ props.row.hidden }}</span></el-form-item>
                  <el-form-item label="最近授权时间："><span>{{ parseTime(props.row.config.lastAuthorizedTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span></el-form-item>
                  <el-form-item label="最后一次在线："><span>{{ parseTime(props.row.lastOnline, "{y}-{m}-{d} {h}:{i}:{s}") }}</span></el-form-item>

                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="Auth" width="70">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="authorize member on network" placement="bottom">
                  <el-checkbox v-model="scope.row.config.authorized" @change="updateAuthorized(scope.$index, client.id, scope.row.config.id, scope.row.config.authorized)"></el-checkbox>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="设备名称"
              prop="name">
            </el-table-column>
            <el-table-column
              label="设备描述"
              prop="description">
            </el-table-column>
            <el-table-column label="ip">
              <template slot-scope="scope">{{ scope.row.config.ipAssignments }}</template>
            </el-table-column>
            <el-table-column label="状态" width="70">
              <template slot-scope="scope">
                <el-tag :type="scope.row.online ? 'success' : 'danger'">{{scope.row.online ? '在线' : '下线'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="openUpdateFrom(scope.$index)" size="small">编辑</el-button>
                <el-button @click.native.prevent="deleteRow(client.id, scope.$index)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <!-- Form -->
        <el-dialog title="编辑member" :visible.sync="dialogFormVisible" @closed="afterClose">
          <el-form :model="memberForm" :rules="rules" ref="memberForm" label-width="100px" size="mini" label-position="left">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="memberForm.name"></el-input>
            </el-form-item>
            <el-form-item label="设备描述" prop="description">
              <el-input type="textarea" v-model="memberForm.description"></el-input>
            </el-form-item>
            <el-form-item label="不可见" prop="hidden">
              <el-switch v-model="memberForm.hidden"></el-switch>
            </el-form-item>
            <el-form-item v-for="(domain, index) in memberForm.config.ipAssignments" prop="ipAssignments" label="IP" :key="index"
                          :rules="{
      message: 'IP不能为空', trigger: 'blur'
    }"
            >
              <el-input type="text" style="width: 195px" v-model="memberForm.config.ipAssignments[index]" ></el-input>
              <el-button @click.prevent="removeDomain(index)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('memberForm')">修改</el-button>
              <el-button @click="addDomain">新增IP</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-collapse>
    </el-main>
    <el-divider></el-divider>
    <el-footer>
      <div class="demo-basic--circle">
        <div class="block" >
          <!--          <el-avatar size="large" src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'></el-avatar>-->
        </div>
        <router-link to="/config">
          <el-button>
            去配置页面
          </el-button>
        </router-link>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { parseTime } from '../utils/date.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      memberData: [],
      sourceNetWork: [],
      msg: 'Welcome to Your Vue.js App',
      dialogFormVisible: false,
      memberForm: {
        index: '',
        name: '',
        description: '',
        hidden: true,
        config: {
          ipAssignments: [],
          noAutoAssignIps: false
        }
      },
      rules: {
        name: [
          { message: '请输入设备名称', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    const token = this.getToken()
    console.log('ddd:' + token)
    if (token === '' || token === null) {
      this.$router.push('/config')
    } else {
      this.getNetWorkList()
    }
  },
  methods: {
    removeDomain (item) {
      console.log('删除：' + item)
      if (item !== -1) {
        this.memberForm.config.ipAssignments.splice(item, 1)
      }
    },
    parseTime (time, cFormat) {
      return parseTime(time, cFormat)
    },
    addDomain () {
      this.memberForm.config.ipAssignments.push('')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.memberForm)
          const netWorkId = this.memberData[this.memberForm.index].networkId
          const memberId = this.memberData[this.memberForm.index].config.id
          this.postAxios('https://api.zerotier.com/api/v1/network/' + netWorkId + '/member/' + memberId, this.memberForm)
          // this.postAxios('/source/network/' + netWorkId + '/member/' + memberId, this.memberForm)
            .then((data) => {
              console.log('修改后返回参数 ： ' + data)
              this.memberData[this.memberForm.index] = data
              this.success('修改成功')
            }).catch((error) => {
              this.error(error)
            })
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterClose () {
      console.log('afterClose')
    },
    openUpdateFrom (index) {
      this.memberForm.index = index
      this.memberForm.name = this.memberData[index].name
      this.memberForm.description = this.memberData[index].description
      this.memberForm.hidden = this.memberData[index].hidden
      this.memberForm.config.ipAssignments = this.memberData[index].config.ipAssignments
      this.memberForm.config.noAutoAssignIps = this.memberData[index].config.noAutoAssignIps
      this.dialogFormVisible = true
    },
    getNetWorkList () {
      this.getAxios('https://api.zerotier.com/api/v1/network', null)
      // this.getAxios('/source/network', null)
        .then((data) => {
          console.log(data)
          this.sourceNetWork = data
        }).catch((error) => {
          this.error(error)
        })
    },
    getMemberListByNetWorkId (netWorkId) {
      this.getAxios('https://api.zerotier.com/api/v1/network/' + netWorkId + '/member', null)
      // this.getAxios('/source/network/' + netWorkId + '/member', null)
        .then((data) => {
          console.log(data)
          this.memberData = data
        }).catch((error) => {
          this.error(error)
        })
    },
    handleChange (val) {
      if (val !== '') {
        console.log(val)
        console.log(this.sourceNetWork[val].id)
        console.log(this.sourceNetWork[val].config.name)
        console.log(this.sourceNetWork[val].description)
        console.log(this.sourceNetWork[val].config.private)
        this.getMemberListByNetWorkId(this.sourceNetWork[val].id)
      }
    },
    deleteRow (netWorkId, memberIndex) {
      console.log('删除的index：' + memberIndex)
      const memberId = this.memberData[memberIndex].config.id
      const memberName = this.memberData[memberIndex].name
      this.$confirm('是否删除设备[' + memberName + ']?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAxios('https://api.zerotier.com/api/v1/network/' + netWorkId + '/member/' + memberId)
        // this.deleteAxios('/source/network/' + netWorkId + '/member/' + memberId)
          .then((data) => {
            console.log(data)
            this.memberData.splice(memberIndex, 1)
            this.success('设备[' + memberName + ']已移除')
          }).catch((error) => {
            this.error(error)
          })
      }).catch(() => {
      })
    },
    updateMember (networkId, memberId, item) {
      // this.postAxios('/source/network/' + networkId + '/member/' + memberId, item)
      //   .then((data) => {
      //     console.log(data.data)
      //
      //   }).catch((error) => {
      //   this.error(error)
      // })
    },
    updateAuthorized (index, netWorkId, memberId, status) {
      console.log(index)
      console.log(netWorkId)
      const memberObject = this.memberData[index]
      memberObject.config.authorized = Boolean(status)
      console.log(memberObject)
      this.postAxios('https://api.zerotier.com/api/v1/network/' + netWorkId + '/member/' + memberId, memberObject)
      // this.postAxios('/source/network/' + netWorkId + '/member/' + memberId, memberObject)
        .then((data) => {
          console.log(data)
          const workName = this.sourceNetWork.filter(item => item.id === netWorkId)[0].config.name + '网络'
          this.success((status ? '加入' : '退出') + workName)
        }).catch((error) => {
          this.error(error)
        })
    },
    getToken () {
      // eslint-disable-next-line no-undef
      const token = utools.dbStorage.getItem('zeroTier_token')
      console.log(token)
      return token
    },
    success (message) {
      this.$notify({
        title: '成功',
        message: message,
        type: 'success',
        duration: 3000
      })
    },
    warning (message) {
      this.$notify({
        title: '警告',
        message: message,
        type: 'warning',
        duration: 3000
      })
    },
    info (message) {
      this.$notify.info({
        title: '消息',
        message: message,
        duration: 3000
      })
    },
    error (message) {
      this.$notify.error({
        title: '错误',
        message: message,
        duration: 3000
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
