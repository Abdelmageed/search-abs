const app = require('./app'),
    request = require('request'),
    baseApiUrl = 'https://www.googleapis.com/customsearch/v1'


app.get('/api/search/:search', (req, res) => {
    let s = `${baseApiUrl}?key=${process.env._GOOGLE_API_KEY}&cx=${process.env._CSE_ID}&q=${req.params.search}&start=${req.query.offset || 1}&alt=json&searchType=image&fields=items(link,snippet,image/thumbnailLink,image/contextLink)`
    request(s, (err, response, body) => {
        if (err) throw err
        if (response.statusCode === 200) {
            insertQuery(req.params.search, new Date())
            res.send(formatResult(body))
        } else {
            res.status(response.statusCode).send('An error has occured')
        }
    })
})

app.get('/api/latest', (req, res) => {
    getLatestQueries ((results) => {
        console.log (results)
        res.send (results)
    })
})

const formatResult = (result) => {
    return JSON.parse(result)['items'].map(item => ({
        link: item.link,
        snippet: item.snippet,
        thumbnail: item.image.thumbnailLink,
        context: item.image.contextLink
    }))
}

const insertQuery = (query, at) => {
    const db = app.locals.db
    db.collection('queries').insertOne({
        query: query,
        at: at
    }, (err, res) => {
        if (err) throw err
    })
}

const getLatestQueries = (callback) => {
    const db = app.locals.db
    db.collection('queries')
        .find({})
        .sort([['_id', -1]])
        .limit(10)
        .project({
            _id: 0,
            query: 1,
            at: 1
        })
        .toArray((err, res) => {
            if (err) throw err
            callback(res)
        })
}