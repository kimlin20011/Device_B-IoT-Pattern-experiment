/**
 * 整合所有子路由
 */

const router = require('koa-router')();

const oei = require('./oei_router');

router.use('/oei', oei.routes(), oei.allowedMethods());



module.exports = router;
