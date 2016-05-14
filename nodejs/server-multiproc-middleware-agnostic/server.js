
let http = require('http')
let debug = require('debug')

module.exports = createServer

const DEBUG_NS = 'server'
let nInstance = 0

/**
 * Set up everything the http server application returning an object to manage the http service.
 * This is the only function exposed for this module.
 *
 * @param {Object} config - Required configurations to run the server
 * @param {Number} config.port - The port number where the server listen
 * @param {Function} config.requestListener - Function signature expected by http.Server `request` event
 * @returns {Object} Object with the methods to manage the application server
 * @throws {Error} Configuration doesn't contain required parameters or contains wrong values
 */
function createServer(config) {
  nInstance++
  let c = createConfig(config)
  let d = debug(c.debugNS)
  let server = http.createServer(c.requestListener)

  return {
    start: start,
    stop: stop
  }

  function start() {
    return new Promise((resolve, reject) => {
      let errListener = function (err) {
        reject(err)
      }

      let listenArgs = c.listenArgs.slice()
      listenArgs.push(() => {
        d('listening %j', server.address())
        server.removeListener('error', errListener)
        errListener = null // Avoid memory leak
        resolve()
      })

      server.once('error', errListener)
      server.listen.apply(server, listenArgs)
    })
  }

  function stop() {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  }
}

/**
 * Check the given configuration and return a shallow copy only containing the expected properties
 *
 * @param {Object} givenConfig - The provided configuration object
 * @returns {Object} Shallow copy of the configuration only containing the expected configuration parameters
 *      and other calculated parameters to easy use by the instance object returned by this module
 * @throws Will throw an error if given configuration doesn't contains or contains an invalid value for a
 *      property
 */
function createConfig(givenConfig) {
  if (!givenConfig) {
    throw new Error('Configuration parameters object is required')
  }

  let expectedKeys = ['port', 'debugNS', 'requestListener']
  let optionalKeys = ['hostname', 'backlog']
  let currentKeys = Object.keys(givenConfig)

  if (currentKeys.length < expectedKeys.length) {
    throw new Error('Invalid configuration '
                    + `it has ${currentKeys.length} properties but ${expectedKeys.length} are required`)
  }

  let c = {}
  expectedKeys.forEach(k => {
    if (givenConfig[k] === undefined) {
      throw new Error(`Invalid configuration ${k} property is required`)
    }
    c[k] = givenConfig[k]
  })

  optionalKeys.forEach(k => {
    if (givenConfig[k] !== undefined) {
      c[k] = givenConfig[k]
    }
  })

  c.listenArgs = []
  ;['port', 'hostname', 'backlog'].forEach(a => {
    if (c[a] === undefined) {
      return
    }

    c.listenArgs.push(c[a])
  })

  c.debugNS += `:${DEBUG_NS}:${process.pid}${nInstance}`

  return c
}
