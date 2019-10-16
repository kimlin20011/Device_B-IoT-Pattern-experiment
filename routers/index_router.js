/**
 * 整合所有子路由
 */

const router = require('koa-router')();

const oei = require('./oei_router');
const ofei = require('./ofei_router');

router.use('/oei', oei.routes(), oei.allowedMethods());
router.use('/ofei', ofei.routes(), ofei.allowedMethods());

module.exports = router;
