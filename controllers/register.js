const handleRegister = (req, res, db, bcrypt) => {
    console.log("new registration");
    console.log('req.body; :', req.body);
    const { email, name, password } = req.body;
    if (!email || !password) {
        console.log('name or email or password is invalid')
        console.log(email, name, password);
        return res.status(400).json('incorrect form submission');
    }
    console.log('req.body; :', req.body;);
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        console.log('start trx');
        console.log('trx :', trx)
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
        console.log('end trx');
    })
    .catch( err => res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
}