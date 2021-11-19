const kcrypto = require('KCrypto')
const base62 = require('base-x')("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

function createWallet () {
  return new Promise((resolve) => {
    const privKey = kcrypto.ed25519.utils.randomPrivateKey()
    kcrypto.ed25519.getPublicKey(privKey).then(publicKey => {
      const base62Key = base62.encode(publicKey)
      const KWallet = 'kX' + base62Key + kcrypto.crc16.crc16(base62Key)
      resolve({ wallet: KWallet, privateKey: Buffer.from(privKey).toString('hex') })
    })
  })
}

function getWalletFromPrivateKey (privateKey) {
  return new Promise((resolve) => {
    const privKey = Uint8Array.from(Buffer.from(privateKey, 'hex'))
    kcrypto.ed25519.getPublicKey(privKey).then(publicKey => {
      const base62Key = base62.encode(publicKey)
      const KWallet = 'kX' + base62Key + kcrypto.crc16.crc16(base62Key)
      resolve({ wallet: KWallet, privateKey: privateKey })
    })
  })
}

function getWalletFromPublicKey (publicKey) {
  return new Promise((resolve) => {
    const base62Key = base62.encode(Buffer.from(publicKey, 'hex'))
    const KWallet = 'kX' + base62Key + kcrypto.crc16.crc16(base62Key)
    resolve(KWallet)
  })
}

function getPublicKeyFromWallet (wallet) {
  return new Promise((resolve) => {
    let publicKey = base62.decode(wallet.replace('kX', '').slice(0, -4))
    resolve(publicKey.toString('hex'))
  })
}

module.exports = { getWalletFromPublicKey, getWalletFromPrivateKey, createWallet, getPublicKeyFromWallet }