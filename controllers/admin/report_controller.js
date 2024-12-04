// [GET] /admin/report
module.exports.home = async (req, res) => {
    res.render("./admin/pages/report.pug")
}