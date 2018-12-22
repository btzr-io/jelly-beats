import Lbry from '@/utils/lbry'

export default function(store) {
  const actions = {
    doUpdateBlockHeight() {
      Lbry.status().then(status => {
        if (status.wallet) {
          store.setState({ latestBlock: status.wallet.blocks })
        }
      })
    },
  }
  return actions
}
