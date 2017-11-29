require('dotenv').config()
const alfy = require('alfy')
const Lyricist = require('lyricist')

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN)

const format = song => {
  const { title, primary_artist, path } = song
  const url = 'https://genius.com' + path
  return {
    title,
    subtitle: primary_artist.name,
    arg: url,
    autocomplete: primary_artist.name + ' - ' + title,
    quicklookurl: url
  }
}

async function search(query) {
  const cached = alfy.cache.get(query)
  if (cached) {
    alfy.output(cached.map(format))
  } else {
    const hits = await lyricist.search(query)
    const tenMinutes = 1000 * 60 * 10 // in milliseconds
    alfy.cache.set(query, hits, { maxAge: tenMinutes })
    alfy.output(hits.map(format))
  }
}

search(alfy.input)
