const router = require('koa-router')();
const exp = require('../controllers/experiments');

module.exports = router
    .get('/getPID', exp.pid)