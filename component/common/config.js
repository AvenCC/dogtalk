module.exports = {
  header: {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  api: {
    base: 'http://rapapi.org/mockjs/17077/api/',
    creation: 'getVideoList',
    up:'up',
    getReply:'getReply',
    sendReply:'sendReply'
  }
}