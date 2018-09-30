const tags = ['rock', 'folk', 'pop', 'ambient', 'electronic', 'psychedelic']

const topics = ['indie', 'summer', 'hybrid', 'dog']

const instruments = ['piano', 'guitar', 'drums']

const relase = ['music', 'track', 'song', 'album', 'ep', 'single']

function multiSearch(text, searchWords) {
  const items = [...tags, ...topics, ...instruments]
  const matchTags = items.reduce((list, tag) => {
    const searchExp = new RegExp(`\\b(${tag})\\b`, 'gi')
    const result = searchExp.exec(text)
    result && list.push(result[0])
    return list
  }, [])
  return matchTags
}

const getTags = description => {
  return multiSearch(description, tags)
}

export { tags, getTags }
