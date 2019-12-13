const updateData = require('../models/odp/updateData');
const updateDataCons = require('../models/exp/odpUpdateData');

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
    async updateDataCons(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let updateDataCons_result = await updateDataCons(formData);
            res = updateDataCons_result;
            ctx.body = res;
        } catch (error) {
            ctx.body = error;
        }
    },
}