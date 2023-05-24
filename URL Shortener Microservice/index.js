require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let nextId = 1; // Short URL id
const urls = {}; // Dictionary to store full URLs

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  if (!validUrl.isWebUri(url)){
    res.json({ error: 'Invalid URL' });
  } else {
    // Look for existing entry in dictionary
    let inDatabase = false;
    for (let i = 0; i <= Object.keys(urls).length; i++) {
      if (urls[i] === url) {
        inDatabase = true;
        res.json({ original_url: url, short_url: i.toString() });
        break;
      }
    }
    if (!inDatabase){
      // Save short URL
      const shortUrl = nextId.toString();
      urls[shortUrl] = url;
      nextId++;
      res.json({ original_url: url, short_url: shortUrl });
    }    
  }  
});

app.get('/api/shorturl/:short_url?', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urls[shortUrl];
  
  // Look for short URL in dictionary
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'no url found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
