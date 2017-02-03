var http = require('http')
var healthpoint = require('./')

var hp = healthpoint({
  version: require('./package.json').version
}, function (cb) {
  // ordinarily you chould check your db connection
  // instead we'll just alternate between healthy and fail every 5 seconds
  var isOk = Math.round(Date.now() / 5000) % 2
  cb(isOk ? null : new Error('Having a bad time...'))
})

http.createServer(function (req, res) {
  if (req.url === '/health') return hp(req, res)
  res.end('Visit /health for the health check')
}).listen(1337)

console.log('Visit http://localhost:1337/health for the health check')
