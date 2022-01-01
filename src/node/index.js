const http = require('http')

module.exports = class Node {
  constructor (rpcUrl) {
    this.rpcUrl = rpcUrl
  }

  async _request (data) {
    const parsedData = JSON.stringify(data)
    const options = { hostname: this.rpcUrl, port: this.rpcUrl.split(":")[1] ?? 80, path: '/', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': parsedData.length } }
    
    const req = https.request(options, res => {
      if (res.statusCode !== 200) throw new Error("Cannot reach node, invalid status code!")
    
      let output = ""
      res.on('data', chunk => {
        output += chunk.toString()
      })

      res.on('end', () => {
        const response = JSON.parse(output)
        if (!response.success) throw new Error("Failed!")

        return response.result
      })
    })

    req.write(parsedData)
    req.end()
  }

  async getTotalBlocks () {
    const response = await this._request({
      "method": 'getTotalBlocks'
    }).response

    return response
  }

  async announceBlock (block) {
    const response = await this._request({
      "method": 'announceBlock',
      "args": [ JSON.stringify(block.toJSON()) ]
    }).response

    return response
  }

  async getBalance (address) {
    const response = await this._request({
      "method": 'getBalance',
      "args": [ address ]
    }).response

    return response
  }
}

