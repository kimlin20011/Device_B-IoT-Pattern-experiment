const router = require('koa-router')();
const ofei = require('../controllers/ofei_controller');

module.exports = router
    .post('/deployQueryRegistry', ofei.deployOFEI_QueryRegistry)
    .post('/dataCallbackByWhisper', ofei.postWhisper)
    .get('/listenQueryEvent', ofei.listenQueryEvent)

