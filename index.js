var xtend = require('xtend')

module.exports = function (opts, fn) {
  if (typeof opts === 'function') {
    fn = opts
    opts = {}
  }

  fn = fn || function (cb) { cb(null) }

  return function healthPoint (req, res) {
    fn(function (err) {
      var health = xtend({
        ts: new Date(),
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        status: err ? 'Error' : 'OK'
      }, opts)

      var status = err ? 500 : 200
      res.writeHead(status, {'Content-Type': 'application/json'})
      return res.end(JSON.stringify(health))
    })
  }
}
