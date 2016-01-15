var express  = require('express'),
    mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');

var app = express();
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/testdb');

require('./middleware.js')(app, express);

app.listen(port, function(){
  console.log('Server now listening on port ' + port);
});

module.exports = {
  app: app,
  mongoose: mongoose
}
