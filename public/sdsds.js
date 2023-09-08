var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://p.jinhui365.cn/seal/query?appkey=gzgjsign_daixiao_9&userId=04C07B0030FC763CE0630240840AC2A3&timestamp=1694144792000&signcode=45EDF2FA5845069C1064087B417F59CE',
  headers: { }
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
