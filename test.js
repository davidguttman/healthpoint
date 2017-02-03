var test = require('tape')
var http = require('http')
var servertest = require('servertest')

var healthpoint = require('./')

test('basic', function (t) {
  var server = http.createServer(healthpoint())

  servertest(server, '/health', {encoding: 'json'}, function (err, res) {
    t.ifError(err, 'should not error')

    t.equal(res.statusCode, 200, 'should have correct status')

    var health = res.body

    t.ok(health.ts, 'has field "ts"')
    t.ok(health.pid, 'has field "pid"')
    t.ok(health.uptime >= 0, 'has field "uptime"')
    t.ok(health.memory, 'has field "memory"')
    t.equal(health.status, 'OK')

    t.end()
  })
})

test('custom function fail', function (t) {
  var server = http.createServer(healthpoint(fail))

  servertest(server, '/health', {encoding: 'json'}, function (err, res) {
    t.ifError(err, 'should not error')

    t.equal(res.statusCode, 500, 'should have correct status')

    var health = res.body

    t.ok(health.ts, 'has field "ts"')
    t.ok(health.pid, 'has field "pid"')
    t.ok(health.uptime >= 0, 'has field "uptime"')
    t.ok(health.memory, 'has field "memory"')
    t.equal(health.status, 'Error')

    t.end()
  })
})

test('custom function success', function (t) {
  var server = http.createServer(healthpoint(victory))

  servertest(server, '/health', {encoding: 'json'}, function (err, res) {
    t.ifError(err, 'should not error')

    t.equal(res.statusCode, 200, 'should have correct status')

    var health = res.body

    t.ok(health.ts, 'has field "ts"')
    t.ok(health.pid, 'has field "pid"')
    t.ok(health.uptime >= 0, 'has field "uptime"')
    t.ok(health.memory, 'has field "memory"')
    t.equal(health.status, 'OK')

    t.end()
  })
})

test('custom properties and function fail', function (t) {
  var server = http.createServer(healthpoint({version: '1.2.3'}, fail))

  servertest(server, '/health', {encoding: 'json'}, function (err, res) {
    t.ifError(err, 'should not error')

    t.equal(res.statusCode, 500, 'should have correct status')

    var health = res.body

    t.ok(health.ts, 'has field "ts"')
    t.ok(health.pid, 'has field "pid"')
    t.ok(health.uptime >= 0, 'has field "uptime"')
    t.ok(health.memory, 'has field "memory"')
    t.equal(health.version, '1.2.3', 'should have version')
    t.equal(health.status, 'Error')

    t.end()
  })
})

test('custom properties and function success', function (t) {
  var server = http.createServer(healthpoint({version: '1.2.3'}, victory))

  servertest(server, '/health', {encoding: 'json'}, function (err, res) {
    t.ifError(err, 'should not error')

    t.equal(res.statusCode, 200, 'should have correct status')

    var health = res.body

    t.ok(health.ts, 'has field "ts"')
    t.ok(health.pid, 'has field "pid"')
    t.ok(health.uptime >= 0, 'has field "uptime"')
    t.ok(health.memory, 'has field "memory"')
    t.equal(health.version, '1.2.3', 'should have version')
    t.equal(health.status, 'OK')

    t.end()
  })
})

function fail (cb) { cb(new Error('oh no!')) }

function victory (cb) { cb() }
