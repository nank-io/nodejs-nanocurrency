class ProxyRPC {
  constructor({ proxyAPI }) {
    this.proxyAPI = proxyAPI
  }

  getAccountInfo(address) {
    return this.proxyAPI.post({
      body: {
        action: 'account_info',
        account: address,
        representative: true,
        pending: true,
        weight: true
      }
    })
  }

  getPending(address) {
    return this.proxyAPI.post({
      body: {
        action: "pending",
        account: address,
        count: "1"
      }
    })
  }
  
  getBalanceOf(address) {
    return this.proxyAPI.post({
      body: {
        action: 'account_balance',
        account: address,
      }
    })
  }

  doProcess({ subtype, block }) {
    return this.proxyAPI.post({
      body: {
        action: 'process',
        json_block: true,
        subtype,
        block,
      }
    })
  }

  doWorkGenerate(hash) {
    return this.proxyAPI.post({
      body: {
        action: 'work_generate',
        hash,
      }
    })
  }
}

module.exports = ProxyRPC

