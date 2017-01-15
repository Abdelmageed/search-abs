const express = require ('express'),      
      app = express ()

//app.use (express.static('/public'))
app.listen (process.env.PORT || 3000, function (){
    console.log (`express server listening to port ${this.address().port} in ${app.settings.env} mode`)
})



module.exports = app