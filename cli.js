const fs = require('fs');
const readline = require('readline');

const args = process.argv.slice(2);

if(args[0] == "--add"){
    let username = args[1];
    var leitor = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    function geraStringAleatoria(tamanho = 12) {
        var stringAleatoria = '';
        var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < tamanho; i++) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return stringAleatoria;
    }
    leitor.question(`Digite a senha para ${username}: `, function(answer) {
        if(answer.length == 0){
            console.log("Você precisa informar a senha");
            return process.exit();
        }
        let id = geraStringAleatoria();
        let user = {};
        user.id = id;
        user.username = username,
        user.password = answer;
        user.preferences = {
            theme: "dracula",
            fontsize: 15
        }
        leitor.close();
        fs.writeFileSync("./db/user_"+id+".json", JSON.stringify(user, null, 4), {encoding: "utf-8"});
        console.log("\nUsúario criado com sucesso");
    });
}

if(args[0] == "--remove"){
    let username = args[1];
    let list_users = [];
    let list_files = fs.readdirSync("./db").filter(e => e.startsWith("user_"));
    for(const filename of list_files){
        const content = fs.readFileSync("./db/"+filename, {encoding: "utf-8"});
        list_users.push(JSON.parse(content));
    }
    list_users = list_users.filter(e => e.username == username);
    for(let user of list_users){
        fs.unlinkSync(`./db/user_${user.id}.json`);
    }
    console.log(`\nRemovido ${list_users.length} usúario(s)`);
}