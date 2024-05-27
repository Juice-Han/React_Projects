'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var client = require('./routes/db.js')

var socket = require('./routes/socket.js');
var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', 3000);
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);



/* Start server */
server.listen(app.get('port'), async function () {
  try{
    await client.connect(); // 데이터베이스 연결
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
  }catch(err){
    console.log(err)
  }
});

module.exports = app;
