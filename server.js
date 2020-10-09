const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('this is working');
})

app.listen(port, () => {
    console.log('app is running on port ', port);
})

/*  
/ --> res = this is working
/signin  --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/
 
