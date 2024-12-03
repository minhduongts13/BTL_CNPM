// [GET] /
module.exports.home = async (req, res) => {
    console.log(req.user);
    res.render("./user/pages/home.pug")
}