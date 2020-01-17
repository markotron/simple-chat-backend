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

app.get('/users', function(req, res) {
  const userId = req.query.userId;
  setTimeout(() => res.json({
    id: userId,
    name: `${randEl(adjectives)} ${randEl(nouns)}`
  }), 1000);
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

function randEl(list) {
  return list[Math.floor(Math.random() * list.length)];
}
const adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
const nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];
