const crypto = require('crypto')
const kpow = require('KPoW')

module.exports = class Block {
  constructor (blockType, blockData) {
    this.blockType = blockType
    this.sender = blockData.sender
    this.recipient = blockData.recipient
    this.amount = blockData.amount
  }

  async setPreviousBlock (node) {
    const block = await node._request({
      "method": "queryChain",
      "args": [ this.sender, 1 ]
    })
    
    this.previousBlock = block[0]?.hash ?? null
  }

  calculateHash () {
    if (typeof this.previousBlock === 'undefined') throw Error('Cannot calculate hash, block not completed.')

    return crypto.createHash('ripemd160').update(this.blockType + this.previousBlock + this.sender + this.recipient + this.amount).digest('hex')
  }

  computeWork () {
    if (typeof this.previousBlock === 'undefined') throw Error('Cannot compute work, block not completed.')

    this.work = kpow.doWork(this.calculateHash())
  }

  async sign (wallet) {
    if (typeof this.previousBlock === 'undefined') throw Error('Cannot sign, block not completed.')

    this.signature = await wallet.sign(this.calculateHash())
  }

  toJSON () {
    return {
      blockType: this.blockType,
      hash: this.calculateHash(),
      previousBlock: this.previousBlock,
      sender: this.sender,
      recipient: this.recipient,
      amount: this.amount,
      work: this.work,
      signature: this.signature
    }
  }
}

