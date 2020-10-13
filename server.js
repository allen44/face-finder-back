const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
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

// console.log(db.select('*').from('users').then(data => {
//     console.log(data);
// }).catch( err => console.log(err))) ; 

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3001;


app.get('/', (req, res) => {
    res.send(database.users);
})
 
///signin  --> POST = success/fail
app.post('/signin', (req, res) => {
    console.log(req.body.email);
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        // console.log(data[0]);
        // console.log(isValid);
        if (isValid) {
            return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    // console.log(user);
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

//register --> POST = user
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return (
                trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
                }).then(user => {
                    res.json(user[0]);
                    })
            )
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch( err=> res.status(400).json('unable to register'));
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params; 
    db.select('*').from('users').where({id})
        .then(user => {
        if(user.length) {
            res.json(user[0]);
       } else {
        res.status(400).json('not found');
       }
    }).catch(err => res.status(400).json('error getting user'))
});;

//image --> PUT = user
app.put('/image', (req, res) => {
    const { id } = req.body;
    db ('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        console.log(entries[0]);
        res.json(entries[0]);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json('unable to get entries');
    });
});



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


app.listen(port, () => {
    console.log('app is running on port ', port);
})
