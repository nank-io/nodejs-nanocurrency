const Wallet = require('../wallet')
const ProxyAPI = require('./index')

describe('ProxyAPI', () => {
  const hostname = 'proxy.nanos.cc'
  const path = '/proxy'

  const ProxyAPI = new ProxyAPI({ hostname, path })

  it('has hostname and path', () => {
    expect(ProxyAPI.hostname).toEqual(hostname)
    expect(ProxyAPI.path).toEqual(path)
  })

  describe('request account_info', () => {
    const wallet = new Wallet()

    describe('when request success', () => {
      let error, response

      beforeEach(async () => {
        await wallet.generate()

        await ProxyAPI.post({
          body: {
            'action': 'account_info',
            'account': wallet.address
          }
        }).then(res => response = res)
        .catch(err => error = err)
      })

      it('returns a response object', () => {
        expect(response instanceof Object).toBe(true)
        expect(error instanceof Error).toBe(false)
      })
    })
    
    describe('when request is failed', () => {
      let error, response

      beforeEach(async () => {
        await wallet.generate()

        await ProxyAPI.post({
          body: {
            'action': 'foo-action',
            'account': wallet.address
          }
        }).then(res => response = res)
        .catch(err => error = err)
      })

      it('returns an error', () => {
        expect(response instanceof Object).toBe(false)
        expect(error instanceof Error).toBe(true)
      })
    })
  })
})