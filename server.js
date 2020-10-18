const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//running in debug mode on localhost
if (process.env.DEBUG) { 
  process.env.DATABASE_URL = "http://127.0.0.1:5432";
  process.env.PORT = 3001;
  process.env.API_CLARIFAI = "1ecace96280949d684f58ca7f728fe66";
}
console.log("process.env.PORT: ", process.env.PORT);
console.log('process.env.DATABASE_URL :', process.env.DATABASE_URL);
console.log('process.env.API_CLARIFAI: ', process.env.API_CLARIFAI);


const { response } = require('express');
const { handleSignin } = require('./controllers/signin');
const { handleRegister } = require('./controllers/register');
const { handleProfileGet } = require('./controllers/profile');
const { handleApiCall, handleImage } = require('./controllers/image');


const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
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


app.listen(PORT || 3001, () => {
    console.log(`app is running on port ${PORT}`);
})
