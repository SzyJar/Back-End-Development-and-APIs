// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/:date?', (req, res) => {
  const { date } = req.params;

  let outputDate
  if (!date) {
    // If no date string is provided, use the current date
    outputDate = new Date();
  }  else if (/^\d+$/.test(date)) {
    // If the parameter is a UNIX timestamp
    outputDate = new Date(parseInt(date));
  } else {
    // Try parsing the provided date string
    outputDate = new Date(date);

    // Check if the provided date string is in a valid format
    if (isNaN(outputDate.getTime())) {
      res.json({ error: 'Invalid date' });
      return;
    }
  }

  res.json({ unix: outputDate.getTime(), utc: outputDate.toUTCString() });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
