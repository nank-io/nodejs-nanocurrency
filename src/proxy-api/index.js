const http = require('http')

class ProxyAPI {
  headers = {
    'Content-Type': 'application/json'
  }

  constructor({ hostname, path }) {
    this.hostname = hostname
    this.path = path
  }

  post({ body }) {
    const method = 'POST'
    return this.requestWrapper({ method, body })
  }

  requestWrapper({ method, body }) {
    return new Promise((resolve, reject) => {
      this.request({ method, body }, (error, response) => {
        if (error) {
          reject(error)
          return
        }

        resolve(response)
      })
    })
  }

  request({ method, body }, callback) {
    const request = http.request({
      hostname: this.hostname,
      path: this.path,
      method,
      headers: this.headers
    }, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        callback(
          new Error(`Failed to fetch URL. Status code: ${response.statusCode}`)
        )

        return
      }
    
      const body = []
    
      response.on('data', chunk => {
        body.push(chunk)
      })
    
      response.on('end', () => {
        const response = body.join('')

        try {
          callback(undefined, JSON.parse(response))
        } catch (error) {
          callback(new Error(error.message || error))
        }
      })
    })
    
    request.on("error", error => {
      callback(error)
    });
    
    request.write(JSON.stringify(body));

    request.end();
    
  }
}

module.exports = ProxyAPI

