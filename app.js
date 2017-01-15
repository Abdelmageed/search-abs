const express = require ('express'),
      request = require ('request'),
      app = express (),
      baseApiUrl = 'https://www.googleapis.com/customsearch/v1'

app.get ('/api/:search', (req, res) => {
    let s = `${baseApiUrl}?key=${process.env._GOOGLE_API_KEY}&cx=${process.env._CSE_ID}&q=${req.params.search}&start=${req.query.offset}&alt=json&searchType=image&fields=items(link,snippet,image/thumbnailLink,image/contextLink)`
    request (s, (err, response, body) => {
        if (err) throw err
        if (response.statusCode === 200) {
            res.send(formatResult (body))
        } else {
            res.status(response.statusCode)
        }
    })
})
app.listen (process.env.PORT || 3000, function (){
    console.log (`express server listening to port ${this.address().port} in ${app.settings.env} mode`)
})

const formatResult = (result) => {
    return JSON.parse(result)['items'].map (item => ({
                link: item.link,
                snippet: item.snippet,
                thumbnail: item.image.thumbnailLink,
                context: item.image.contextLink
            }))
}