const kafiumJS = require('./')

const wallet = kafiumJS.wallet.create()

console.log('Generated wallet:', wallet)

const imported = new kafiumJS.wallet(wallet.privateKey)

console.log('Excepted:', imported)