const express = require ('express'),      
      app = express (),
      mongo = require ('mongodb').MongoClient

mongo.connect (process.env._IMAGE_SEARCH_DB, (err, db) => {
    if (err) throw err
    console.log ('connected to database successfuly')
    app.locals.db = db
})
app.use (express.static('public'))

app.listen (process.env.PORT || 3000, function (){
    console.log (`express server listening to port ${this.address().port} in ${app.settings.env} mode`)
})



module.exports = app