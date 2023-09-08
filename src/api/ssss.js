const axios = require('axios')

const instance = axios.create({
  transformRequest: [function (data, headers) {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      const params = new URLSearchParams()
      for (let key in data) {
        params.append(key, data[key])
      }
      return params.toString()
    }
    return data
  }]
})

instance.post('http://localhost:9090/user/riskGradeEvaluation', {
  'token': 'HVCXqOIb9zU=',
  'uid': '2076117',
  'appkey': 'gjgd_wz_692e6da69f',
  'timestamp': '1684144858673',
  'platformId': '25',
  'riskVersion': 'v4',
  'answers': 'B,C,C,B,A,D,C,B,C|D,D,B,B|C,B,C,B,D,B,C,B,B',
  'signcode': 'f55e3ff2d9b7960bc0e3b720162a3710'
}, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })
