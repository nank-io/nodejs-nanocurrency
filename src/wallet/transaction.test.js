const Transaction = require('./transaction')
const Wallet = require('./index')

const mnemonic = 'curious entire coral neck draw nose hurt any bunker goose kitten palace suspect prosper caution mansion recycle broom truly middle autumn more loyal leisure'
const toWalletMnemonic = 'stomach claim mango clever palm adapt travel wage trust gown cheap spoil join soap garlic bachelor crouch erode alien stamp fatal update piano kidney'

describe('Transaction', () => {
  let transaction, fromWallet, toWallet

  beforeEach(() => {
    fromWallet = new Wallet()
    fromWallet.importWithMnemonic(mnemonic)
    
    toWallet = new Wallet()
    toWallet.importWithMnemonic(toWalletMnemonic)
    
    transaction = new Transaction({ wallet: fromWallet })
  })

  describe('send()', () => {
    describe('failed send transaction', () => {
      let response, error
  
      beforeEach(async () => {
        try {
          await transaction.send({
            amount: wallet.balance + 1000000,
            to: toWallet.address
          })
        } catch (err) {
          error = err
        }
      })
  
      it('returns an error', () => {
        expect(error instanceof Error).toBe(true)
      })
    })
    
    describe('success send transaction', () => {
      let response
  
      beforeEach(async () => {
        response = await transaction.send({
          amount: wallet.balance,
          to: toWallet.address
        })
      })
  
      it('returns `hash` of pending transaction', () => {
        expect(response).toHaveProperty('hash')
      })
    })
  })
})