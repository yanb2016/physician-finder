const express = require('express')
const { Client } = require('pg')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
const port = 3000;

app.use('/static', express.static(path.join(__dirname, '../client/build/static')))
app.use(bodyParser.json());

// return template
app.get('/', function(req, response, next) {
  response.sendFile('index.html', { root: path.join(__dirname, '../client/build/')});
});
app.get('/physician/:firstName/:middleName/:lastName', function(req,response,next) {
  // get names from params
  const firstName = req.params['firstName'];
  const middleName = req.params['middleName'];
  const lastName = req.params['lastName'];

  // init a new client and connect
  const client = new Client()
  client.connect()

  // set query with firstname and lastname,
  // if get duplicate results, filter it later
  const query = {
    text: 'SELECT * FROM list WHERE firstname = $1 and lastname = $2',
    values: [firstName, lastName]
  }
  
  // query physician according to the input name
  client.query(query)
    .then(res => {
      // if result contains more than people having the same first and last name,
      // then check the middle name
      const len = res.rows.length;

      // if result empty, send 400 code
      if(len === 0) {
        response.status(400).send('Physician Not in Database')
        throw 400
      }
      
      if(len > 1) {
        for(let i = 0; i < len; i++) {
          if(res.rows[i].middlename === middleName) {
            response.json(res.rows[i])
          }
        }
      }
      // otherwise, just return the only person
      response.json(res.rows[0])
    })
    .catch(e => console.error(e))
    .finally(() => {
      client.end((err) => {
        console.log('client has disconnected')
        if (err) {
          response.status(404).send('error during disconnection', err.stack)
        }
      })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// commants for copying csv file to db
// create table first
// and then copy csv file to db
// COPY list(firstname,middlename, lastname, address, city, state) 
// FROM '/Users/yanbinjin/Downloads/PGYR16_P011819/physician.csv' DELIMITER ',' CSV HEADER;

// query adress 
// SELECT address, city, state FROM list WHERE lastname='Delisi'and firstname='Craig';

// SELECT address, city, state FROM list WHERE lastname= "Delisi" and firstname = "Craig";