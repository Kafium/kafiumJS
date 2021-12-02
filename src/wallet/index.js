const kcrypto = require('KCrypto')
const base62 = require('base-x')("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

class Wallet {
  async constructor (privateKey) {
    this.privateKey = privateKey
    this.publicKey = await kcrypto.ed25519.getPublicKey(Uint8Array.from(Buffer.from(this.privateKey), 'hex'))

    const base62Key = base62.encode(publicKey)

    this.walletAddress = 'kX' + base62Key + kcrypto.crc16.crc16(base62Key)
  }

  async static create () {
    const privKey = kcrypto.ed25519.utils.randomPrivateKey()

    return new Wallet(Buffer.from(privKey).toString('hex'))
  }

  async sign (hash) {
    const signature = await kcrypto.ed25519.sign(hash, Uint8Array.from(Buffer.from(this.privateKey, 'hex')))

    return Buffer.from(signature).toString('hex')
  }
}

module.exports = { Wallet }