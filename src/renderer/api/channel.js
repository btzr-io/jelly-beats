import Lbry from '@/utils/lbry'

function getMultipleValues(str) {
  str = str.replace(/\s+/g, '')
  return str.split(',')
}

function getProfileData(dataTemplate, res) {
  const { claim } = res
  if (claim && claim.channel_name && claim.value && claim.value.stream) {
    // Get channelName
    const { metadata } = claim.value.stream

    if (metadata && metadata.description) {
      // Get profile data
      const parsed = JSON.parse(metadata.description)
      dataTemplate.name = parsed.name
      dataTemplate.thumbnail = parsed.thumbnail
      dataTemplate.location = parsed.location
      dataTemplate.tags = getMultipleValues(parsed.type)
      // Active flag
      dataTemplate.hasProfile = true
    }
  }
  return dataTemplate
}

function fetchChannelProfile(channel, callback) {
  const profileUri = `${channel.nickname}/profile`

  Lbry.resolve({ uri: profileUri })
    .then(res => {
      // Claim exists
      const profileData = getProfileData(channel, res)
      callback(profileData)
    })
    .catch(err => {
      // No extended metadata
      callback(channel)
    })
}

export default function fetchChannel(data, callback) {
  const { name, nout, txid, height, claim_id, permanent_url } = data

  // Default channel data
  const channel = {
    id: claim_id,
    uri: permanent_url,
    tags: [],
    block: height,
    name: name.substring(1),
    nickname: name,
    outpoint: `${txid}:${nout}`,
    location: null,
    hasProfile: false,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Cubozoa.jpg',
  }

  fetchChannelProfile(channel, callback)
}
