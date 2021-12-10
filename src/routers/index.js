module.exports = (app) => {
    app.get("/", (req, res) => {
        if(!req.user) return res.redirect("/login");
        app.src.controllers.index.view(app, req, res);
    });
}