const crypto = require('crypto')

const WebSocket = require('ws')
const curve = require('noble-ed25519')

const waitForData = require('./utils/socket').waitForData
const getWalletFromPrivateKey = require('./index').getWalletFromPrivateKey

const EventEmitter = require('events').EventEmitter

module.exports = class Web3 extends EventEmitter {
  constructor (nodeAddress) {
    super()

    this.ws = new WebSocket(nodeAddress)
    this.ws.on('open', () => {
      this.status = 'READY'
      this.emit('ready')
    })
  }

  getWalletBalance (KWallet) {
    if (!this.status === 'READY') throw new Error('NOT_CONNECTED')
    return new Promise((resolve, reject) => {
      this.ws.send(`getWalletBalance:${KWallet}`)

      waitForData(this.ws, 'walletBalance').then(balance => {
        resolve(parseInt(balance.split(':')[1]))
      }).catch(err => {
        reject(err)
      })
    })
  }

  getLastHash (KWallet) {
    if (!this.status === 'READY') throw new Error('NOT_CONNECTED')
    return new Promise((resolve, reject) => {
      this.ws.send(`getLastHash:${KWallet}`)

      waitForData(this.ws, 'lastHash').then(hash => {
        resolve(hash.split(':')[1])
      }).catch(err => {
        reject(err)
      })
    })

  }

  signTransaction (privKey, receiver, amount) {
    if (!this.status === 'READY') throw new Error('NOT_CONNECTED')
    return new Promise((resolve) => {
      getWalletFromPrivateKey(privKey).then(wallet => {
        this.ws.send(`getLastHash:${wallet.KWallet}`)

        waitForData(this.ws, 'lastHash').then(hash => {
          const createdAt = Date.now()
          const latestHash = hash.toString().split(':')[1]
          const calculateHash = crypto.createHash('ripemd160').update(createdAt + latestHash + wallet.KWallet + receiver + amount).digest('hex')
          curve.sign(calculateHash, privKey).then(tx => {
            resolve({ signature: tx, hash: calculateHash, data: `${createdAt}|${wallet.KWallet}|${wallet.publicKey}|${receiver}|${amount}|${tx}` })
          })
        })
      })
    })
  }

  bcTransactionBlock (data) {
    if (!this.status === 'READY') throw new Error('NOT_CONNECTED')
    return new Promise((resolve, reject) => {
      this.ws.send(`newRawTransaction:${data}`)
      waitForData(this.ws, 'queuedSuccess').then(data => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}