const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.urlencoded({extended: true}));

const accountData = fs.readFileSync('src/json/accounts.json', 'utf8');
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync('src/json/users.json', 'utf8');
const users = JSON.parse(userData);

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Account Summary',
        accounts: accounts
    });
});

app.get('/savings', (req, res) => {
    res.render('account', {
        account: accounts.savings
    });
});

app.get('/checking', (req, res) => {
    res.render('account', {
        account: accounts.checking
    });
});

app.get('/credit', (req, res) => {
    res.render('account', {
        account: accounts.credit
    });
});

app.get('/profile', (req, res) => {
    res.render('profile', {
        user: users[0]
    });
});

app.get('/transfer', (req, res) => {
    res.render('transfer');
});

app.get('/payment', (req, res) => {
    res.render('payment', {
        account: accounts.credit
    });
});

app.post('/payment', (req, res) => {
    accounts.credit.balance = accounts.credit.balance - req.body.amount;
    accounts.credit.available = parseInt(accounts.credit.available) + parseInt(req.body.amount);
    accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, '/json/accounts.json'), accountsJSON, 'utf8');
    res.render('payment', {
        message: "Payment Successful", 
        account: accounts.credit
    });
});

app.post('/transfer', (req, res) => {
    const {from, to, amount} = req.body;
    const newBalanceFrom = accounts[from].balance - amount;
    accounts[from].balance = newBalanceFrom;
    const newBalanceTo = parseInt(accounts[to].balance) + parseInt(amount);
    accounts[to].balance = newBalanceTo;
    accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, '/json/accounts.json'), accountsJSON, 'utf8');
    res.render('transfer', {
        message: "Transfer Completed"
    });
});

app.listen(3000, () => {
    console.log('PS Project Running on port 3000!');
});