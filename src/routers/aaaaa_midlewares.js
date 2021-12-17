const session = require('express-session');
const fs = require('fs');
module.exports = (app) => {

    const sess = {
        secret: app.config.secretSession,
        resave: false,
        saveUninitialized: true,
        cookie: { sameSite: true }
    };

    if(app.config.useSSL && !app.config.ssl.port){
        sess.cookie.secure = true;
    }

    app.use(session(sess));

    app.use('/', (req, res, next) => {
        if(req.session.user){
            let json = fs.readFileSync(`./db/user_${req.session.user}.json`, {encoding: "utf-8"});
            req.user = JSON.parse(json);
        }
        next();
    })

    app.use('/api', (req, res, next) => {
        if(req.session.user){
            next();
        }else{
            res.send({
                error: {
                    code: 500,
                    message: "Não autenticado"
                },
                status: 500,
                data: {}
            });
        }

    })

}