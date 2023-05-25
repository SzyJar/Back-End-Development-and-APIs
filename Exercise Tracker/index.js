const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = [];
const exercises = [];

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (username != ''){
    let inDatabase = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i] === username) {
        inDatabase = true;
        res.json({ username: username, _id: i });
        break;
      };
    };
    if (!inDatabase) { 
      users.push(username);
      res.json({ username: username, _id: users.length - 1 });
    };
  };
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = parseInt(req.params._id);
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  let date = new Date(req.body.date);
  if (isNaN(date.getTime())) {
    date = new Date()
  };
  if (users.length > id && description != '' && duration != '' && !isNaN(duration)) {
    exercises.push({
      username: users[id],
      description: description,
      duration: duration,
      date: date.toDateString(),
      _id: id
    })
    res.json( exercises[ exercises.length - 1 ] );
  };
  res.json( 'error: bad input - no data was inserted into database' );
});

app.get('/api/users', (req, res) => {
  let output = []
  for (let i = 0; i < users.length; i++) {
    output.push({
      _id: i.toString(),
      username: users[i]
    });
  };
  res.json( output );
});

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  let output = {
      _id: id,
      username: users[id],
      count: 0,
      log: []
    };
    for (let i = 0; i < exercises.length; i++) {
    if (exercises[i]._id == id) {
      output.count = output.count + 1;
      if ((new Date(from) < new Date(exercises[i].date) || from == null) &&
          new Date(to) > new Date(exercises[i].date) || to == null) {
      output.log.push({
        description: exercises[i].description,
        duration: exercises[i].duration,
        date: exercises[i].date
      })};
      if ( limit == output.log.length) { break };
    };
  };
  res.json( output );
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
