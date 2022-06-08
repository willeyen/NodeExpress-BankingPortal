const express = require('express');
const router = express.Router();

const { accounts, writeJSON } = require('../data');

router.get('/transfer', (req, res) => {
    res.render('transfer');
});

router.get('/payment', (req, res) => {
    res.render('payment', {
        account: accounts.credit
    });
});

router.post('/transfer', (req, res) => {
    const {from, to, amount} = req.body;
    const newBalanceFrom = accounts[from].balance - amount;
    accounts[from].balance = newBalanceFrom;
    const newBalanceTo = parseInt(accounts[to].balance) + parseInt(amount);
    accounts[to].balance = newBalanceTo;
    writeJSON();
    res.render('transfer', {
        message: "Transfer Completed"
    });
});

router.post('/payment', (req, res) => {
    accounts.credit.balance = accounts.credit.balance - req.body.amount;
    accounts.credit.available = parseInt(accounts.credit.available) + parseInt(req.body.amount);
    writeJSON();
    res.render('payment', {
        message: "Payment Successful", 
        account: accounts.credit
    });
});

module.exports = router;