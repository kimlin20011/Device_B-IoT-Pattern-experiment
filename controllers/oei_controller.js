const deployQueryRegistery = require('../models/oei/deployQueryRegistry');
const deployConsumer = require('../models/oei/deployConsumer')
const callback = require('../models/oei/callback')
const listenQueryEvent = require('../models/oei/listenQueryEvent')



module.exports = {
    async deployQueryRegistery(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let deployQueryRegistery_result = await deployQueryRegistery(formData);
            res = deployQueryRegistery_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
    async deployConsumer(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let deployConsumer_result = await deployConsumer(formData);
            res = deployConsumer_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
    async callback(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let callback_result = await callback(formData);
            res = callback_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
    async listenQueryEvent(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let listenQueryEvent_result = await listenQueryEvent();
            res = listenQueryEvent_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
    // async listenQueryEvent(ctx) {
    //     try {
    //         let listenQueryEvent_result = await listenQueryEvent();
    //         ctx.body = listenQueryEvent_result;
    //     } catch (error) {
    //         ctx.body = error;
    //     }
    // },
}