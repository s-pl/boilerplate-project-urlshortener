require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Database = require("easy-json-database");
const db = new Database("./database.json", {});
const dns = require('dns')
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl/', (req, res, next) => {
  const url = req.body.url;

  // Verificar si la URL es válida
  try {
    
    const urlObj = new URL(url);
console.log(urlObj)
    
    const host = urlObj.host;

    // Realizar la verificación DNS
    dns.lookup(host, (err, address, family) => {
      if (err) {
        res.json({ error: 'invalid url' });
      } else {
       
        const id = Math.floor(1000 + Math.random() * 9000);
      db.set(String(id),String(url))
        
        res.json({ original_url: url, short_url: id });
      }
    });
  } catch (error) {
    
    res.json({ error: 'invalid url' });
  }
});
app.get('/api/shorturl/:id', function(req, res) {
  var url = db.get(req.params.id)
  if(url){
    res.redirect(url)
  }else{
    res.json({error:"there´s something wrong with the id"})
  }
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});






function log (c){

    console.log(c)

}