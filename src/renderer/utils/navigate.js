import history from '@root/history'

const navigate = (href, params = {}) => {
  //Go to location:
  href && history.push({ hash: href, state: params })
}

export default navigate
