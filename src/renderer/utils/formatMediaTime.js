import moment from 'moment'
import memoize from 'memoize-one'

export const formatDuration = (seconds = 0) => {
  const duration = moment.duration(seconds, 'seconds')
  return moment
    .utc(duration.asMilliseconds())
    .format(seconds >= 3600 ? 'hh:mm:ss' : 'mm:ss')
}

export const memoizeFormatDuration = memoize(formatDuration)
