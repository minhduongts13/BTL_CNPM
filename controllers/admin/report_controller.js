const userModel = require("../../models/user_model.js")

// [GET] /admin/report
module.exports.home = async (req, res) => {
    const data = await userModel.getDataReportAdmin();
    console.log(data);
      
    res.render("./admin/pages/report.pug", {
        datatest: data
    })
}