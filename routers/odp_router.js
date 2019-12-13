const router = require('koa-router')();
const odp = require('../controllers/odp_controller');

module.exports = router
    .post('/updateData', odp.updateData)
    .post('/updateDataCons', odp.updateDataCons)
