const updateData = require('../models/odp/updateData');

module.exports = {
    async updateData(ctx) {
        let formData = ctx.request.body;
        //console.log(`odp_controller`)
        let res = {};
        try {
            let updateData_result = await updateData(formData);
            res = updateData_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
}