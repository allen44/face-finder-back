const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const morgan = require('morgan');

console.log(process.env.POSTGRES_URI);
const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: process.env.POSTGRES_URI
  // connection: {
  //   host :  process.env.POSTGRES_HOST, //'127.0.0.1',
  //   user : process.env.POSTGRES_USER,
  //   password : process.env.POSTGRES_PASSWORD,
  //   database : process.env.POSTGRES_DB
  // }
});

// console.log('db', db)

const app = express();


app.use(cors())
app.use(bodyParser.json());
app.use(morgan('combined'));

// console.log('whasasda?')

app.get('/', (req, res)=> { res.send('its working') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
