const handleRegister = (req, res, db, bcrypt) => {
    console.log("new registration");
    console.log('req.body; :', req.body);
    const { email, name, password } = req.body;
    if (!email || !password) {
        console.log('name or email or password is invalid')
        console.log(email, name, password);
        return res.status(400).json('incorrect form submission');
    }
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
        .catch(err => {
            console.log('err 1 :', err);
            trx.rollback;
        })
        console.log('end trx');
    })
    .catch( err => {
        console.log('err 2: ', err)
        res.status(400).json(err);
    });
}

module.exports = {
    handleRegister: handleRegister
}