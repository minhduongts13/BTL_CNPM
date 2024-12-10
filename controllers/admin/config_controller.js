const userModel = require("../../models/user_model.js")
const {prefixAdmin} = require("../../configs/system.js")

// [GET] /admin/config
module.exports.home = async (req, res) => {
    const configInfo = await userModel.getConfig();

    res.render("./admin/pages/config.pug", {
        configInfo: configInfo
    })
}

// [POST] /admin/config
module.exports.updateConfig = async (req, res) => {
    const providingDate = req.body.providingDate;
    const paperPerMonth = req.body.paperPerMonth;
    const pdf = req.body.pdf;
    const doc = req.body.doc;
    const pptx = req.body.pptx;
    const png = req.body.png;
    const jpg = req.body.jpg;

    await userModel.updateConfig(providingDate, paperPerMonth, pdf, doc, pptx, png, jpg);

    res.redirect(`${prefixAdmin}/config`)
}