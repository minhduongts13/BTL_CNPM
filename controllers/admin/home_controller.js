

// [GET] /admin
module.exports.home = async (req, res) => {
    console.log(req.user);
    res.render("./admin/pages/home.pug")
}