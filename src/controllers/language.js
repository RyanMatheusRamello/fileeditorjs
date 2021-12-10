const extensions = [

    {
        name: "abap",
        extension: ["abap"]
    },
    {
        name: "abc",
        extension: ["abc"]
    },
    {
        name: "batchfile",
        extension: ["bat", "cmd"]
    },
    {
        name: "c_cpp",
        extension: ["cpp", "c", "cc", "cxx", "h", "hh", "hpp", "ino"]
    },
    {
        name: "csharp",
        extension: ["cs"]
    },
    {
        name: "css",
        extension: ["css"]
    },
    {
        name: "d",
        extension: ["d"]
    },
    {
        name: "golang",
        extension: ["go"]
    },
    {
        name: "html",
        extension: ["html", "htm", "xhtml", "xht", "wpy", "we"]
    },
    {
        name: "handlebars",
        extension: ["handlebars"]
    },
    {
        name: "ini",
        extension: ["ini", "conf"]
    },
    {
        name: "java",
        extension: ["java"]
    },
    {
        name: "javascript",
        extension: ["js", "jsm", "jsx", "mjs", "cjs"]
    },
    {
        name: "json",
        extension: ["json"]
    },
    {
        name: "kotlin",
        extension: ["kt"]
    },
    {
        name: "less",
        extension: ["less"]
    },
    {
        name: "lua",
        extension: ["lua"]
    },
    {
        name: "markdown",
        extension: ["md", "markdown"]
    },
    {
        name: "mysql",
        extension: ["mysql"]
    },
    {
        name: "objectivec",
        extension: ["m", "mm"]
    },
    {
        name: "pascal",
        extension: ["pas", "pp", "inc"]
    },
    {
        name: "perl",
        extension: ["pl", "pm", "p6", "pl6", "pm6"]
    },
    {
        name: "pgsql",
        extension: ["pgsql"]
    },
    {
        name: "php",
        extension: ["php", "inc", "phtml", "shtml", "php3", "php4", "php5", "phps","phpt", "aw", "ctp", "module"]
    },
    {
        name: "python",
        extension: ["py"]
    },
    {
        name: "r",
        extension: ["r"]
    },
    {
        name: "ruby",
        extension: ["rb", "ru", "gemspec", "rake"]
    },
    {
        name: "scss",
        extension: ["scss"]
    },
    {
        name: "sass",
        extension: ["sass"]
    },
    {
        name: "rust",
        extension: ["rs"]
    },
    {
        name: "sh",
        extension: ["sh", "bash", ".bashrc"]
    },
    {
        name: "sql",
        extension: ["sql"]
    },
    {
        name: "swift",
        extension: ["swift"]
    },
    {
        name: "typescript",
        extension: ["ts", "typescript", "str"]
    },
    {
        name: "vb",
        extension: ["vbs", "vb"]
    },
    {
        name: "xml",
        extension: ["xml", "rdf", "rss", "wsdl", "xslt", "atom", "mathml", "mml", "xul", "xbl", "xaml", "svg"]
    },
    {
        name: "yaml",
        extension: ["yaml", "yml"]
    },
    {
        name: "twig",
        extension: ["twig"]
    },
    {
        name: "text",
        extension: ["txt"]
    }

]

module.exports.get = (app, req, res) => {

    try {

        if(!req.query.ext) throw new Error("Não definido a extensão que você quer saber a linguagem");
        if(typeof req.query.ext !== "string") throw new Error("Parametro ext deve ser uma string");

        const ext = req.query.ext;
        let find = extensions.find(e => e.extension.indexOf(ext) !== -1);
        if(!find){
            find = {
                name: "text",
                extension: ["txt"]
            }
        }
        res.send({
            status: 200,
            error: {},
            data: find
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