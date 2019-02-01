import moment from 'moment'

export const formatDuration = (seconds = 0) => moment.utc(seconds * 1000).format('mm:ss')
