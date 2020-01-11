var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var port = process.env.PORT || 5000;
var db = require('./database');

const count = 5;

app.use(cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res) {
  const uuid = req.query.uuid;
  const userId = req.query.userId;
  const msgs = uuid == null ? db.getLastMessages(userId, count) : db.getMessagesBefore(userId, uuid, count);
  res.json(msgs);
});

app.get('/messages/lastRead', function(req, res) {
  const userId = req.query.userId;
  const lastReadId = db.getLastReadMessageForUser(userId);
  res.json(lastReadId || "null");
});

app.get('/messages/starred', function(req, res) {
  const userId = req.query.userId;
  const beforeId = req.query.beforeId;
  const starredMessages = db.getStarredMessages(userId, beforeId, count);
  res.json(starredMessages);
});

io.on('connection', function(socket){
  socket.on('new-message', function(msg){
    db.addMessage(msg);
    io.emit('new-message', msg);
  });
  // userTyping is [UserId, boolean]
  socket.on('user-typing', function(userTyping) {
    io.emit('user-typing', userTyping);
  });
  socket.on('message-read', function({userId, messageId}) {
    db.setLastReadMessageForUser(userId, messageId);
  });
  socket.on('message-starred', function({userId, messageIdToStar}){
    db.toggleMessageStar(userId, messageIdToStar);
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
