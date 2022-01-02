const tweetnacl = require('tweetnacl')
const base62 = require('base-x')("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

const CRC8 = require('CRC8')

module.exports = class Wallet {
  constructor (privateKey) {
    this.privateKey = privateKey

    const publicKey = tweetnacl.sign.keyPair.fromSecretKey(Uint8Array.from(Buffer.from(this.privateKey, 'hex'))).publicKey
    this.publicKey = Buffer.from(publicKey).toString('hex')

    const base62Key = base62.encode(publicKey)

    this.walletAddress = 'kX' + base62Key + CRC8(base62Key)
  }

  static create () {
    const privKey = tweetnacl.sign.keyPair().secretKey

    return new Wallet(Buffer.from(privKey).toString('hex'))
  }

  async sign (message) {
    const signature = await tweetnacl.sign(Uint8Array.from(Buffer.from(message, 'hex')), Uint8Array.from(Buffer.from(this.privateKey, 'hex')))

    return Buffer.from(signature).toString('hex')
  }
}

