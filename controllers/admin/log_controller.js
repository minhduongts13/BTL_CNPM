const userModel = require("../../models/user_model.js")

// [GET] /admin/log
module.exports.home = async (req, res) => {
    let page;
    if (req.query.page) page = req.query.page
    else page = 1;

    const totalLog = await userModel.getTotalLogAdmin();

    const logs = await userModel.getLogAdmin(page);

    res.render("./admin/pages/log.pug", {
        page: page,
        totalLog: totalLog,
        logs: logs
    })
}