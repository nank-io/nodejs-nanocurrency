const nanocurrency = require('nanocurrency')
const bip39 = require('bip39')

class Wallet {
  constructor() {
  }

  async generate() {
    this.seed = await nanocurrency.generateSeed()
    
    this.secretKey = nanocurrency.deriveSecretKey(this.seed, 0)
    this.publicKey = nanocurrency.derivePublicKey(this.secretKey)
    this.address = nanocurrency.deriveAddress(this.publicKey, { useNanoPrefix: true })

    this.mnemonic = bip39.entropyToMnemonic(this.seed)
  }

  importWithMnemonic(mnemonic) {
    this.mnemonic = mnemonic

    this.seed = bip39.mnemonicToEntropy(this.mnemonic)
    
    this.secretKey = nanocurrency.deriveSecretKey(this.seed, 0)
    this.publicKey = nanocurrency.derivePublicKey(this.secretKey)
    this.address = nanocurrency.deriveAddress(this.publicKey, { useNanoPrefix: true })
  }
  
  static isValid(wallet) {
    if (!nanocurrency.checkSeed(wallet.seed)) {
      throw new Error('seed is invalid')
    }
    
    if (!nanocurrency.checkKey(wallet.secretKey)) {
      throw new Error('secretKey is invalid')
    }
    
    if (!nanocurrency.checkKey(wallet.publicKey)) {
      throw new Error('publicKey is invalid')
    }
    
    if (!nanocurrency.checkAddress(wallet.address)) {
      throw new Error('address is invalid')
    }
    
    if (!bip39.validateMnemonic(wallet.mnemonic)) {
      throw new Error('mnemonic is invalid')
    }

    return true
  }
}

module.exports = Wallet