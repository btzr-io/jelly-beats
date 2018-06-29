const tags = ['rock', 'folk', 'pop', 'ambient', 'electronic', 'piano']

function multiSearch(text, searchWords) {
  const matchTags = tags.reduce((list, tag) => {
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
