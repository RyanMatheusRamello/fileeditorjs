module.exports = (app) => {
    app.get("/api/list", (req, res) => {
        app.src.controllers.api.list(app, req, res);
    });
    app.get("/api/icons", (req, res) => {
        app.src.controllers.api.icons(app, req, res);
    });
    app.get("/api/content/get", (req, res) => {
        app.src.controllers.api.getContent(app, req, res);
    });
    app.post("/api/content/set", (req, res) => {
        app.src.controllers.api.setContent(app, req, res);
    });
    app.get("/api/language", (req, res) => {
        app.src.controllers.language.get(app, req, res);
    });
    app.get("/api/user/preferences/get", (req, res) => {
        app.src.controllers.user_preferences.get(app, req, res);
    });
    app.get("/api/user/preferences/set/theme", (req, res) => {
        app.src.controllers.user_preferences.set("theme", req, res);
    });
    app.get("/api/user/preferences/set/fontsize", (req, res) => {
        app.src.controllers.user_preferences.set("fontsize", req, res);
    });
    app.get("/api/file/new", (req, res) => {
        app.src.controllers.api.new_file(app, req, res);
    });
    app.get("/api/file/remove", (req, res) => {
        app.src.controllers.api.removeFile(app, req, res);
    });
    app.get("/api/folder/new", (req, res) => {
        app.src.controllers.api.new_folder(app, req, res);
    });
    app.get("/api/folder/remove", (req, res) => {
        app.src.controllers.api.removeFolder(app, req, res);
    });
}