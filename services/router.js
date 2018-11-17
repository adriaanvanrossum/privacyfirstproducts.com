const url = require('url')

const { end, options } = require.main.require('./services/utils')

module.exports.default = async (req, res, routes) => {
  const method = req.method.toLowerCase()

  try {
    // Defaults
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*') // Alles mag
    res.statusCode = 200

    // Get the path without a beginning and trailing slash
    let { pathname: path } = url.parse(req.url)
    path = (path.replace(/[/]+$/, '') || '/index').substr(1)

    // Run functions corresponding to request
    const route = routes[path]
    if (!route) return end(req, res, 404, 'Not found')
    if (!route[method] && method !== 'options') return end(req, res, 405, `Method '${method}' not valid`)
    if (method === 'options') return options(req, res, Object.keys(route))
    if (typeof route[method] !== 'function') return end(req, res, 500, `No function specified for method '${method}'`)
    return route[method](req, res)
  } catch (error) {
    console.error(error)
    return end(req, res, 500, 'Server error')
  }
}