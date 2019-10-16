const deploy_OFEI_QueryRegistry = require('../models/ofei/deploy_OFEI_QueryRegistry');
const post_whisper = require('../models/ofei/postWhisper');
const listenQueryEvent = require('../models/ofei/listenQueryEvent');

module.exports = {
    async deployOFEI_QueryRegistry(ctx) {
        //let formData = ctx.request.body;
        let res = {};
        try {
            let deployQueryRegistery_result = await deploy_OFEI_QueryRegistry();
            res = deployQueryRegistery_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
    async postWhisper(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let postWhisper_result = await post_whisper(formData);
            res = postWhisper_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
    async listenQueryEvent(ctx) {
        //let formData = ctx.request.body;
        let res = {};
        try {
            let listenQueryEvent_result = await listenQueryEvent();
            res = listenQueryEvent_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
}