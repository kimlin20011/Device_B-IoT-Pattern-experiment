/**
 * 整合所有子路由
 */

const router = require('koa-router')();

const oei = require('./oei_router');
const ofei = require('./ofei_router');
const exp = require('./experiments_router');

router.use('/oei', oei.routes(), oei.allowedMethods());
router.use('/ofei', ofei.routes(), ofei.allowedMethods());
router.use('/exp', exp.routes(), exp.allowedMethods());

module.exports = router;
