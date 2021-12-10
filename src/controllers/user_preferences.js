const { writeFileSync } = require('fs');

module.exports.get = (app, req, res) => {
    
    res.send({
        status: 200,
        error: {},
        data: req.user.preferences
    })

}

module.exports.set = (type, req, res) => {

    try {

        if(!req.query.data) throw new Error("Envie o valor que sera salvo");
        if(typeof req.query.data !== "string") throw new Error("O valor tem que ser uma string");
    
        req.user.preferences[type] = req.query.data;

        writeFileSync("./db/user_"+req.user.id+".json", JSON.stringify(req.user, null, 4), {encoding: "utf-8"});
        
        res.send({
            status: 200,
            error: {},
            data: {
                message: "Salvo com sucesoo"
            }
        })

    } catch(err) {
        
        res.send({
            status: 500,
            error: {
                code: err.code ?? null,
                name: err.name,
                message: err.message
            },
            data: {}
        });

    }

}