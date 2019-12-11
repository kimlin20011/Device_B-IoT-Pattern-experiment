const router = require('koa-router')();
const exp = require('../controllers/exp_controller');

module.exports = router
    //.get('/getPID', exp.pid)
    .get('/getPIDusage', exp.getPIDusage)