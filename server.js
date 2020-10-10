const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}
app.get('/', (req, res) => {
    res.send(database.users);
})

///signin  --> POST = success/fail
app.post('/signin', (req, res) => {
    console.log('req.body.email', req.body.email)
    // res.json(req.body);
    console.log('req.body.password', req.body.password)
    // bcrypt.compare("apples", '$2a$10$8QH3imwFhvd91Ol/U76.jeKV//vBMmBD6ZUIfe9lNgrm/MwoQXUjq', function(err, res) {
    //     console.log('first guess', res);
    // });
    // bcrypt.compare("veggies", '$2a$10$8QH3imwFhvd91Ol/U76.jeKV//vBMmBD6ZUIfe9lNgrm/MwoQXUjq', function(err, res) {
    //     console.log('second guess', res);
    // });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in'); 
        }
})

//register --> POST = user
app.post('/register', (req, res) => {
    const { email, name } = req.body;
    bcrypt.hash("bacon", null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    }) 
    res.json(database.users[database.users.length-1]);
})

//profile/:userId --> GET = user
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    // if (id in database.users) {}
    let found = false;
    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }
})

//image --> PUT = user
app.put('/image', (req, res) => {
    const { id } = req.body;
    // if (id in database.users) {}
    let found = false;
    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }
})




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
