const Wallet = require('../wallet')
const ProxyRPC = require('./index')

describe('ProxyRPC', () => {
  const hostname = 'proxy.nanos.cc'
  const path = '/proxy'

  const proxyRPC = new ProxyRPC({ hostname, path })

  it('has hostname and path', () => {
    expect(proxyRPC.hostname).toEqual(hostname)
    expect(proxyRPC.path).toEqual(path)
  })

  describe('request account_info', () => {
    const wallet = new Wallet()

    describe('when request success', () => {
      let error, response

      beforeEach(async () => {
        await wallet.generate()

        await proxyRPC.post({
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

        await proxyRPC.post({
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