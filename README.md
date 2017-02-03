# healthpoint

Easily expose your http server's health.

## Example

```js
var http = require('http')
var healthpoint = require('healthpoint')

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
```

## API

### healthpoint([properties, check])
### healthpoint([properties])
### healthpoint([check])

`healthpoint()` will return an http request handler function. `healthpoint()` takes up to two optional arguments, `properties` and `check`.

Any key/value pairs on `properties` will be exposed on the health check JSON. This is useful for adding things like your app's version.

`check` is a function that will be called with a callback. If the callback is called with an error as its argument, the health check JSON will have a 500 statusCode and will display `status: 'Error'`.

## License

MIT
