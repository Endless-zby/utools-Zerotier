console.log('preload js loaded')
// preload.js 中使用 nodejs
const axios = require('axios')
const { readFileSync } = require('fs')
const childProcess = require('child_process')
const exec = childProcess.exec

window.serverStatus = axios.create({
  baseURL: utools.dbStorage.getItem('zeroTier_server_baseUrl'),
  headers: {
    'Content-Type': 'application/json',
    // 只读权限
    'X-ZT1-Auth': utools.dbStorage.getItem('zeroTier_server_token')
  }
})

window.readServerToken = (filePath) => {
  return readFileSync(filePath)
}

window.viewProcessMessage = (idname) => {
  // process 不用引入，nodeJS 自带
  // 带有命令行的list进程命令是：“cmd.exe /c wmic process list full”
  //  tasklist 是没有带命令行参数的。可以把这两个命令再cmd里面执行一下看一下效果
  // 注意：命令行获取的都带有换行符，获取之后需要更换换行符。可以执行配合这个使用 str.replace(/[\r\n]/g,"") 去除回车换行符
  let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return console.error(err)
    }
    utools.dbStorage.setItem('zeroTier_server_status', false)
    stdout.split('\n').forEach((line) => {
      let processMessage = line.trim().split(/\s+/)
      // processMessage[0]进程名称 ， processMessage[1]进程id
      let processName = processMessage[0]
      console.log('进程id: ' + processMessage[1] + ', 进程名称: ' + processName)
      // console.log('---------------------------------' + String(processName).includes('zerotier'))
      if (String(processName).includes(idname)) {
        utools.dbStorage.setItem('zeroTier_server_status', true)
      }
    })
  })
}

// window.viewProcessMessage('name.exe', function (msg) {
// 关闭匹配的进程
// process.kill(msg)
// })
