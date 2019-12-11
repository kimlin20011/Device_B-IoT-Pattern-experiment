const pidusageTest = require('../models/exp/pidusageTest');

module.exports = {
    async getPIDusage(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let pidusageTest_result = await pidusageTest(formData);
            res = pidusageTest_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
}