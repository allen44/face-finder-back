const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const { handleSignin } = require('./controllers/signin');
const { handleRegister } = require('./controllers/register');
const { handleProfileGet } = require('./controllers/profile');
const { handleApiCall, handleImage } = require('./controllers/image');
const db = knex({
    client: 'pg',  
    connection: {
      host : '127.0.0.1',
      port: 5432,
      user : 'postgres',
      password : 'postgres',
      database : 'postgres'
    }
  });

const PORT = process.env.PORT
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => res.send('it is working'));
app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res ) =>  { handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { handleApiCall(req, res) });

const port = 3001; 
app.listen(PORT || 3001, () => {
    console.log(`app is running on port ${PORT}`);
})
