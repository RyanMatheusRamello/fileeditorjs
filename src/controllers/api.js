const fs = require('fs');
const path = require('path');
module.exports.list = (app, req, res) => {

    try {

        if(!req.query.folder) throw new Error("Não definido a pasta que você quer acessar");
        if(typeof req.query.folder !== "string") throw new Error("Parametro folder deve ser uma string");
        const folder_str = req.query.folder.replace(/\.\.[\/\\]/gm, '');
        if(folder_str == ""){
            folder_str = "./";
        }
        const folder = path.normalize(folder_str);
        const data = fs.readdirSync(folder);
        const response = {folder: [], file: []};
        for(let resp of data){
            let path_string = path.join(folder, resp);
            if(fs.lstatSync(path_string).isDirectory()){
                response.folder.push({
                    name: resp,
                    path: path_string
                })
            }else{
                response.file.push({
                    name: resp,
                    path: path_string
                })
            }
        }
        res.send({
            status: 200,
            error: {},
            data: response
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

module.exports.icons = (app, req, res) => {

    try {
        let data = [
            {
                ext: ["json"],
                icon: "bx bxs-file-json",
                color: "yellow"
            },
            {
                ext: ["php", "php7", "phtml"],
                icon: "bx bxl-php",
                color: "blue"
            },
            {
                ext: ["js"],
                icon: "bx bxs-file-js",
                color: "yellow"
            },
            {
                ext: ["css"],
                icon: "bx bxl-css3",
                color: "aqua"
            },
            {
                ext: ["html", "xhtml", "htm", "ghtml"],
                icon: "bx bxl-html5",
                color: "aqua"
            },
            {
                ext: ["py"],
                icon: "bx bxl-python",
                color: "yellow"
            }
        ]
        res.send({
            status: 200,
            data: data
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

module.exports.getContent = (app, req, res) => {

    try {

        if(!req.query.file) throw new Error("Não definido o arquivo que você quer acessar");
        if(typeof req.query.file !== "string") throw new Error("Parametro file deve ser uma string");
        const folder_str = req.query.file.replace(/\.\.[\/\\]/gm, '');
        if(folder_str == ""){
            folder_str = "./";
        }
        const folder = path.normalize(folder_str);
        const stat = fs.lstatSync(folder);
        if(!stat.isFile()){
            throw new Error("Isso não é um arquivo");
        }
        const response = {
            content: "",
            path: Buffer.from(folder).toString('base64')
        }
        response.content = fs.readFileSync(folder, {encoding: "utf-8"});
        res.send({
            status: 200,
            error: {},
            data: response
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

module.exports.setContent = (app, req, res) => {

    try {

        if(!req.body.file) throw new Error("Não definido o arquivo que você quer alterar o conteudo");
        if(typeof req.body.file !== "string") throw new Error("Parametro file deve ser uma string");
        if(!req.body.content) throw new Error("Não definido o conteudo do arquivo");
        if(typeof req.body.content !== "string") throw new Error("Parametro content deve ser uma string");
        const folder_str = req.body.file.replace(/\.\.[\/\\]/gm, '');
        if(folder_str == ""){
            folder_str = "./";
        }
        const folder = path.normalize(folder_str);
        const stat = fs.lstatSync(folder);
        if(!stat.isFile()){
            throw new Error("Isso não é um arquivo");
        }
        fs.writeFileSync(folder, req.body.content, {encoding: "utf-8"});
        res.send({
            status: 200,
            error: {},
            data: {
                message: "Salvo com sucesso"
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

module.exports.new_file = (app, req, res) => {

    try {

        if(!req.query.folder) throw new Error("Não definido a pasta onde o arquivo será salvo");
        if(typeof req.query.folder !== "string") throw new Error("Parametro file deve ser uma string");
        if(!req.query.name) throw new Error("Não definido o nome do o arquivo será salvo");
        if(typeof req.query.name !== "string") throw new Error("Parametro name deve ser uma string");
        const folder_str = req.query.folder.replace(/\.\.[\/\\]/gm, '');
        if(req.query.name.indexOf("/") !== -1 || req.query.name.indexOf("\\") !== -1){
            throw new Error("Caracteres invalidos no nome do arquivo");
        }
        if(req.query.name == "." || req.query.name == ".."){
            throw new Error("nome invalido do arquivo");
        }
        if(fs.existsSync(path.join(folder_str, req.query.name))){
            throw new Error("Arquivo já existente");
        }
        fs.writeFileSync(path.join(folder_str, req.query.name), "", { encoding: "utf-8"});
        res.send({
            status: 200,
            error: {},
            data: {
                message: "Criado com sucesso"
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

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
};

module.exports.removeFile = (app, req, res) => {

    try {
        if(!req.query.file) throw new Error("Não definido o arquivo que será removido");
        if(typeof req.query.file !== "string") throw new Error("Parametro file deve ser uma string");
        const folder_str = req.query.file.replace(/\.\.[\/\\]/gm, '');
        if(!fs.existsSync(folder_str)){
            throw new Error("Arquivo não existente");
        }
        fs.unlinkSync(folder_str);
        res.send({
            status: 200,
            error: {},
            data: {
                message: "deletado com sucesso"
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

module.exports.removeFolder = (app, req, res) => {

    try {
        if(!req.query.folder) throw new Error("Não definido a pasta que sera deletada");
        if(typeof req.query.folder !== "string") throw new Error("Parametro folder deve ser uma string");
        const folder_str = req.query.folder.replace(/\.\.[\/\\]/gm, '');
        if(!fs.existsSync(folder_str)){
            throw new Error("pasta não existente");
        }
        deleteFolderRecursive(folder_str);
        res.send({
            status: 200,
            error: {},
            data: {
                message: "deletado com sucesso"
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

module.exports.new_folder = (app, req, res) => {

    try {

        if(!req.query.folder) throw new Error("Não definido a pasta onde a pasta será criada");
        if(typeof req.query.folder !== "string") throw new Error("Parametro folder deve ser uma string");
        if(!req.query.name) throw new Error("Não definido o nome da pasta que será salvo");
        if(typeof req.query.name !== "string") throw new Error("Parametro name deve ser uma string");
        const folder_str = req.query.folder.replace(/\.\.[\/\\]/gm, '');
        if(req.query.name.indexOf("/") !== -1 || req.query.name.indexOf("\\") !== -1){
            throw new Error("Caracteres invalidos no nome da pasta");
        }
        if(req.query.name == "." || req.query.name == ".."){
            throw new Error("nome invalido da pasta");
        }
        if(fs.existsSync(path.join(folder_str, req.query.name))){
            throw new Error("Arquivo já existente");
        }
        fs.mkdirSync(path.join(folder_str, req.query.name));
        res.send({
            status: 200,
            error: {},
            data: {
                message: "Criado com sucesso"
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