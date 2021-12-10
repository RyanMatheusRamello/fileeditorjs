const { readdirSync, readFileSync } = require('fs');
const bodyParser = require('body-parser');
module.exports = (app) => {
    app.get("/login", (req, res) => {
        if(req.user){
            return res.redirect("/");
        }
        res.render("login");
    });
    app.post("/login", bodyParser.urlencoded({ extended: false }), (req, res) => {
        try {
            if(req.user){
                return res.redirect("/");
            }
            if(!req.body.username || !req.body.password){
                throw new Error("Envie todos os parametros");
            }
            if(req.body.username.trim().length == 0 || req.body.password.trim().length == 0){
                throw new Error("Envie o username e a senha");
            }
            const username = req.body.username.trim();
            const password = req.body.password.trim();
            let list_users = [];
            let list_files = readdirSync("./db").filter(e => e.startsWith("user_"));
            for(const filename of list_files){
                const content = readFileSync("./db/"+filename, {encoding: "utf-8"});
                list_users.push(JSON.parse(content));
            }
            list_users = list_users.filter(e => e.username == username);
            if(list_users.length == 0){
                throw new Error("Usúario não encontrado");
            }
            if(list_users.length > 1){
                throw new Error("Mais que um usúario foi encontrado, não é possível logar como esse usúario");
            }
            if(list_users[0].password !== password){
                throw new Error("Senha incorreta");
            }
            req.session.user = list_users[0].id;
            res.redirect("/");
            
        } catch(err) {
            res.render("login", {message: err.message});
        }
    });
}