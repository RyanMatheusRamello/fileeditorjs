# FileEditor

Este projeto é um editor de arquivos criado em nodejs para edição rápida de código

# 
## Instalação

Entre no seu terminal e digite:

```
git clone https://github.com/RyanmatheusRamello/fileeditorjs editorfolder
```

Acesse a pasta `editorfolder` e instale as dependências

```
npm install
```

depois pode iniciar o editor com

```
npm start
````

# 
## Configurações

No arquivo `config.json` você poderá configurar o editor, segue a lista de parâmetros


> **secretSession**
> 
> Uma palavra secreta que será usada para o token de sessão

> **useSSL**
>
> Um Boolean (true|false) informando se deve criar um servidor https

> **port**
>
> A porta que será usada para o editor (se ssl.port for definido com valor diferente de false, o valor desse campo será usado para criar um servidor http)

> **domain**
> 
> O domínio de acesso ao editor

> **ssl**
> 
> Um objeto contendo o certificado ssl e a porta usada para o servidor https

# 
## Exemplos de configurações

* Editor HTTP (http://localhost:8081)

```json
{
    "secretSession": "secret-session",
    "useSSL": false,
    "port": 8081
}
```

* Editor HTTPS (https://localhost:8081)

```json
{
    "secretSession": "secret-session",
    "useSSL": true,
    "port": 8081,
    "domain": false,
    "ssl": {
        "cert": "ssl/server.crt",
        "key": "ssl/server.key",
        "port": false
    }
}
```


* Editor HTTP e HTTPS (http://localhost:8081) (https://localhost:8080)

```json
{
    "secretSession": "secret-session",
    "useSSL": true,
    "port": 8081,
    "domain": false,
    "ssl": {
        "cert": "ssl/server.crt",
        "key": "ssl/server.key",
        "port": 8080
    }
}
```

# 
## usuários

Os usuários são armazenados na pasta db, mas você pode adicionar ou remover via terminal

* Adicionar um usuário

```
node cli.js --add "username"
```

* Remover um usuário

```
node cli.js --remove "username"
```
