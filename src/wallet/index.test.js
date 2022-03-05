const Wallet = require('./index')

describe('Wallet', () => {
  const wallet = new Wallet()

  describe('generate()', () => {
    beforeEach(async () => {
      await wallet.generate()
    })
    
    it('has a `seed`', () => {
      expect(wallet).toHaveProperty('seed')
    })
  
    it('has a `secretKey`', () => {
      expect(wallet).toHaveProperty('secretKey')
    })
  
    it('has a `publicKey`', () => {
      expect(wallet).toHaveProperty('publicKey')
    })
  
    it('has an `address`', () => {
      expect(wallet).toHaveProperty('address')
    })
  
    it('has a `mnemonic`', () => {
      expect(wallet).toHaveProperty('mnemonic')
    })
  })

  describe('importWithMnemonic()', () => {
    let importedWallet
  
    beforeEach(() => {
      importedWallet = new Wallet()
    })

    describe('import success', () => {
      beforeEach(() => {
        importedWallet.importWithMnemonic(wallet.mnemonic)
      })
  
      it('seed equal to seed from imported wallet', () => {
        expect(importedWallet.seed).toEqual(wallet.seed)
      })
    })

    describe('when mnemonic is invalid', () => {
      it('throws an error', () => {
        expect(() => importedWallet.importWithMnemonic('')).toThrow('Invalid mnemonic')
      })
    })
  })

  describe('isValid()', () => {
    beforeEach(async () => {
      await wallet.generate()
    })
    
    describe('when wallet is valid', () => {
      it('returns true', () => {
        expect(Wallet.isValid(wallet)).toBe(true)
      })
    })

    describe('when wallet is invalid', () => {
      it('and the `seed` is invalid', () => {
        wallet.seed = 'foo-seed'
        expect(() => Wallet.isValid(wallet)).toThrow('seed is invalid')
      })

      it('and the `secretKey` is invalid', () => {
        wallet.secretKey = 'foo-secret-key'
        expect(() => Wallet.isValid(wallet)).toThrow('secretKey is invalid')
      })

      it('and the `publicKey` is invalid', () => {
        wallet.publicKey = 'foo-public-key'
        expect(() => Wallet.isValid(wallet)).toThrow('publicKey is invalid')
      })

      it('and the `address` is invalid', () => {
        wallet.address = 'foo-address'
        expect(() => Wallet.isValid(wallet)).toThrow('address is invalid')
      })

      it('and the `mnemonic` is invalid', () => {
        wallet.mnemonic = 'foo-mnemonic'
        expect(() => Wallet.isValid(wallet)).toThrow('mnemonic is invalid')
      })
    })
  })
})