const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

/* Routa na domovskou stránku http://localhost:3000/ */
app.get('/', function (req, res) {
  // console.log(req)
  res.render('index')
})

/* Routa na stránku http://localhost:3000/about */
app.get('/about', function (req, res) {
    res.render('about')
})

/* Routa na stránku http://localhost:3000/about */
app.post('/submit', (req, res) => {
    let newMessage = {
      author: req.body.author,
      message: req.body.message,
      timestamp: new Date().toISOString(),
      ip: req.ip.split(':').pop()
    }
    fs.readFile('data.json', (err, data) => {
      if (err) throw err;
      if (data) {
        let messages = JSON.parse(data);
        messages.push(newMessage);
        fs.writeFile('data.json', JSON.stringify(messages), function (err) {
          if (err) throw err;
          res.send("Díky za informace, jsou uloženy")
        }); 
      }
    })
})

/* Routa na stránku http://localhost:3000/messages/json */
app.get('/messages/json', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) throw err;
    if (data) {
      let messages = JSON.parse(data);
      // res.render('messages', { messages: messages })
      res.json(messages);
    }
  })  
})

app.get('/messages', (req, res) => {
  let autor = req.query.autor;
  let datum = req.query.datum;
  fs.readFile('data.json', (err, data) => {
    if (err) throw err;
    if (data) {
      let messages = JSON.parse(data);
      if (autor) {
        messages = messages.filter(message => message.author.includes(autor));
      }
      if (datum) {
        messages = messages.filter(message => {
          const messageDate = new Date(message.timestamp).toISOString().split('T')[0];
          return messageDate === datum;
      });
}
      res.render('messages', { zpravy: messages, autor: 'Marek Lučný' })
    }
  })  
})

app.listen(3000)