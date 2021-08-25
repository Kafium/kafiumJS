const crypto = require('crypto')
const curve = require('noble-ed25519')

const uint8 = require('./utils/uint8')

function createWallet () {
  return new Promise((resolve) => {
    const privKey = curve.utils.randomPrivateKey()
    curve.getPublicKey(privKey).then(publicKey => {
      const publicKeyHex = uint8.uint8ToHex(publicKey)
      const KWallet = 'kX' + crypto.createHash('ripemd160').update(publicKeyHex).digest('hex') + publicKeyHex.slice(-6)
      resolve({ KWallet: KWallet, publicKey: publicKeyHex, privateKey: uint8.uint8ToHex(privKey) })
    })
  })
}

function getWalletFromPrivateKey (privateKey) {
  return new Promise((resolve) => {
    const privKey = uint8.hexToUint8(privateKey)
    curve.getPublicKey(privKey).then(publicKey => {
      const publicKeyHex = uint8.uint8ToHex(publicKey)
      const KWallet = 'kX' + crypto.createHash('ripemd160').update(publicKeyHex).digest('hex') + publicKeyHex.slice(-6)
      resolve({ KWallet: KWallet, publicKey: publicKeyHex, privateKey: privateKey })
    })
  })
}

function getKWalletFromPublicKey (publicKey) {
  return new Promise((resolve) => {
    const KWallet = 'kX' + crypto.createHash('ripemd160').update(publicKey).digest('hex') + publicKey.slice(-6)
    resolve(KWallet)
  })
}

module.exports = { getKWalletFromPublicKey, getWalletFromPrivateKey, createWallet }