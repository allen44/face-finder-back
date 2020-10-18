const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT ? process.env.PORT : 3000;
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgres://trpcpyvswpkalt:f83866c680643ad157279f152a4d3e5eedf085ace990ced0a43f15602b3e6402@ec2-52-2-82-109.compute-1.amazonaws.com:5432/dhae89btn2sek";
const API_CLARIFAI = process.env.API_CLARIFAI ? process.env.API_CLARIFAI : '1ecace96280949d684f58ca7f728fe66';
const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res, API_CLARIFAI)})

app.listen(PORT, ()=> {
  console.log(`app is running on port ${PORT}`);
})
