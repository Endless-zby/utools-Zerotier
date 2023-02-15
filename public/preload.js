console.log('preload js loaded')
// preload.js 中使用 nodejs
const axios = require('axios')
const { readFileSync } = require('fs')

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
