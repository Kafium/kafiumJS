const http = require('http')

module.exports = class Node {
  constructor (rpcUrl) {
    this.rpcUrl = rpcUrl
  }

  _request (data) {
    return new Promise((resolve, reject) => {
      const parsedData = JSON.stringify(data)
      const options = { hostname: this.rpcUrl.split(":")[0], port: this.rpcUrl.split(":")[1] ?? 80, path: '/', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': parsedData.length } }
      
      const req = http.request(options, res => {
        if (res.statusCode !== 200) return reject("cannot_reach_node")
      
        let output = ""
        res.on('data', chunk => {
          output += chunk.toString()
        })
  
        res.on('end', () => {
          const response = JSON.parse(output)
          if (!response.success) return reject(`failed`)
  
          resolve(response.result)
        })
      })
  
      req.write(parsedData)
      req.end()
    })
  }

  async getTotalBlocks () {
    const response = await this._request({
      "method": 'getTotalBlocks'
    })

    return response
  }

  async announceBlock (block) {
    const response = await this._request({
      "method": 'announceBlock',
      "args": [ JSON.stringify(block.toJSON()) ]
    })

    return response
  }

  async getBalance (address) {
    const response = await this._request({
      "method": 'getBalance',
      "args": [ address ]
    })

    return response
  }
}

