const kafiumJS = require('./')

kafiumJS.createWallet().then(wallet => {
  console.log('Generated wallet:', wallet)

  kafiumJS.getWalletFromPrivateKey(wallet.privateKey).then(wallet => {
    console.log('Excepted:', wallet)

    kafiumJS.getPublicKeyFromWallet(wallet.wallet).then(publicKey => {
      console.log('Public Key:', publicKey)

      kafiumJS.getWalletFromPublicKey(publicKey).then(wallet => {
        console.log('Wallet from Public Key:', wallet)
      })
    })
  })
})