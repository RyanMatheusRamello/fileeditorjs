async function loadPrincipalFiles(){

    let query = location.search.slice(1);
    let partes = query.split('&');
    let data = {};
    partes.forEach(function (parte) {
        let chaveValor = parte.split('=');
        let chave = chaveValor[0];
        let valor = chaveValor[1];
        data[chave] = valor;
    });

    window.folder = data.folder ?? "./"

    let response = await $.ajax({
        url: "/api/list",
        data: {
            folder: data.folder ?? "./"
        }
    });
    if(response.status == 500){
        alert("Houve um erro ao tentar obter sua lista de arquivos");
        return false;
    }
    let icons = await $.ajax({
        url: "/api/icons"
    });
    if(icons.status == 500){
        alert("Houve um erro ao tentar obter a lista de icones");
        return false;
    }
    window.icons = icons.data;
    let langs = await $.ajax({
        url: "/static/js/list_languages.json"
    });
    window.language = langs;
    let themes = await $.ajax({
        url: "/static/js/list_themes.json"
    });
    window.themes = themes;
    let user = await $.ajax({
        url: "/api/user/preferences/get"
    });
    if(user.status == 500){
        alert("Houve um erro ao tentar obter a lista de linguagens");
        return false;
    }
    window.user = user.data;
    return response.data;

}

async function loadContentFile(filename){

    let response = await $.ajax({
        url: "/api/content/get",
        data: {
            file: filename
        }
    });
    if(response.status == 500){
        alert("Houve um erro ao tentar obter sua lista de arquivos");
        return false;
    }
    return response.data;

}

async function getLanguage(ext){

    let response = await $.ajax({
        url: "/api/language",
        data: {
            ext: ext
        }
    });
    if(response.status == 500){
        alert("Houve um erro ao tentar obter sua lista de arquivos");
        return false;
    }
    return response.data;

}

async function reloadFiles(){

    $(".folder_file_filho").remove();
    let response = await $.ajax({
        url: "/api/list",
        data: {
            folder: window.folder ?? "./"
        }
    });
    if(response.status == 500){
        return Swal.fire({
            icon: "error",
            title: "Ops!",
            message: "Um erro ocorreu, tente novamente"
        });
    }
    let files = response.data;

    for(let item of files.folder){
        id = "fc_"+RandomString();
        let filho = $(document.createElement("div"));
        filho.attr({
            class: "folder_file_filho",
            "data-index": 0,
            "data-path": btoa(item.path),
            "data-type": "folder",
            "data-id": id,
            "data-open": 0,
            "data-parent": "null",
            "title": item.path
        })
        filho.css({
            "padding-left": "1em"
        });
        icon = $(document.createElement("span"));
        icon.attr({
            class: "folder_file_icon"
        }).html("<i class='bx bxs-folder'></i>")
        text = $(document.createElement("span"));
        text.attr({
            class: "folder_file_name"
        }).text(item.name)
        icon.appendTo(filho);
        text.appendTo(filho);
        filho.on("click", async (e) => {
            let _this = e.currentTarget;
            await loadFolder(_this);
        })
        filho.on("contextmenu", contextFolderMenu)
        filho.appendTo(".folder_files");
    }

    for(let item of files.file){
        id = "fc_"+RandomString();
        let filho = $(document.createElement("div"));
        filho.attr({
            class: "folder_file_filho",
            "data-index": 0,
            "data-path": btoa(item.path),
            "data-type": "file",
            "data-id": "ff_"+btoa(item.path),
            "data-intab": 0,
            "data-parent": "null",
            "title": item.path
        })
        filho.css({
            "padding-left": "1em"
        });
        icon = $(document.createElement("span"));
        icon.attr({
            class: "folder_file_icon"
        }).html("<i class='bx bxs-file'></i>")
        text = $(document.createElement("span"));
        text.attr({
            class: "folder_file_name"
        }).text(item.name)
        icon.appendTo(filho);
        text.appendTo(filho);
        filho.on("click", async (e) => {
            await loadFile(e.currentTarget);
        })
        filho.on("contextmenu", contextFileMenu)
        filho.appendTo(".folder_files");
    }

}

function newFile(f = {}){
    if(typeof f == "object"){
        f = window.folder;
    }
    Swal.fire({
        title: 'Nome do arquivo',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        backdrop: true,
        showCancelButton: true,
        confirmButtonText: 'Criar',
        showLoaderOnConfirm: true,
        preConfirm: async (name) => {
            return await $.ajax({
                url: "/api/file/new",
                data: {
                    folder: f ?? window.folder,
                    name: name
                }
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            if(result.value.status == 200){
                Swal.fire({
                    icon: "success",
                    title: "Criado",
                    text: "Criado com sucesso"
                }).then(() => {
                    reloadFiles();
                })
            }
        }
      })
}

async function removeFile(_this){

    let filename = atob($(_this).attr("data-path"));

    let r = await $.ajax({
        url: "/api/file/remove",
        data: {
            file: filename
        }
    })
    let code = r.status;
    if(code == 200){
        Swal.fire({
            icon: "success",
            text: "Deletado com sucesso"
        });
        reloadFiles();
    }else{
        Swal.fire({
            icon: "error",
            text: r.error.message
        });
    }
    return code == 200;

}

async function removeFolder(_this){

    let filename = atob($(_this).attr("data-path"));

    let r = await $.ajax({
        url: "/api/folder/remove",
        data: {
            folder: filename
        }
    })
    let code = r.status;
    if(code == 200){
        Swal.fire({
            icon: "success",
            text: "Deletado com sucesso"
        });
        reloadFiles();
    }else{
        Swal.fire({
            icon: "error",
            text: r.error.message
        });
    }
    return code == 200;

}

function newFolder(f = {}){
    if(typeof f == "object"){
        f = window.folder;
    }
    Swal.fire({
        title: 'Nome da pasta',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        backdrop: true,
        showCancelButton: true,
        confirmButtonText: 'Criar',
        showLoaderOnConfirm: true,
        preConfirm: async (name) => {
            return await $.ajax({
                url: "/api/folder/new",
                data: {
                    folder: f,
                    name: name
                },
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            if(result.value.status == 200){
                Swal.fire({
                    icon: "success",
                    title: "Criado",
                    text: "Criado com sucesso"
                }).then(() => {
                    reloadFiles();
                })
            }
        }
      })
}

async function saveFile(){
    let $el = $(".tab_files_editor_item.active");
    if($el.length > 0){
        if($el.attr("data-file") !== "welcome"){
            let file = $el.attr("data-file");
            let editor = window.editor.get(file);
            let name = atob(file.substr(3));
            let content = editor.getValue();
            let result = await $.ajax({
                url: "/api/content/set",
                method: "POST",
                data: {
                    file: name,
                    content: content
                },
            });
            if(result.status == 200){
                return Swal.fire({
                    icon: "success",
                    text: "Salvo com sucesso"
                });
            }
            Swal.fire({
                icon: "error",
                text: result.error.message
            })
        }
    }
}


async function contextFileMenu(e){

    e.preventDefault();
    $(".context-menu-file").remove();
    $("body").off("click");

    let x = e.clientX;
    let y = e.clientY;

    if(x + 150 > window.innerWidth){
        x = window.innerWidth - 150;
    }
    if(y + 450 > window.innerHeight){
        y = window.innerHeight - 150;
    }

    let context = $(document.createElement("div")).css({
        position: "absolute",
        left: x + "px",
        top: y + "px",
        width: 250 + "px",
        background: "#1d1f23",
        padding: "5px 0 5px 0"
    }).addClass("context-menu-file").appendTo("body");

    $(document.createElement("span")).attr({
        class: "context_attr"
    }).html("Abrir").on("click", (ev) => {
        $(".context-menu-file").remove();
        $("body").off("click");
        loadFile(e.currentTarget);
    }).appendTo(context);
    $(document.createElement("span")).attr({
        class: "context_attr"
    }).html("Remover").on("click", (ev) => {
        $(".context-menu-file").remove();
        $("body").off("click");
        removeFile(e.currentTarget);
    }).appendTo(context);

    $("body").on("click", (ev) => {
        if($(ev.target).hasClass("context-menu-file")){
            return;
        }
        if($(ev.target).children(".context-menu-file").length > 0){
            return;
        }
        $(".context-menu-file").remove();
        $("body").off("click");
    })

}

async function contextFolderMenu(e){

    e.preventDefault();
    $(".context-menu-file").remove();
    $("body").off("click");

    let x = e.clientX;
    let y = e.clientY;

    if(x + 150 > window.innerWidth){
        x = window.innerWidth - 150;
    }
    if(y + 450 > window.innerHeight){
        y = window.innerHeight - 150;
    }

    let context = $(document.createElement("div")).css({
        position: "absolute",
        left: x + "px",
        top: y + "px",
        width: 250 + "px",
        background: "#1d1f23",
        padding: "5px 0 5px 0"
    }).addClass("context-menu-file").appendTo("body");

    $(document.createElement("span")).attr({
        class: "context_attr"
    }).html("Acessar").on("click", (ev) => {
        $(".context-menu-file").remove();
        $("body").off("click");
        $(e.currentTarget).click();
    }).appendTo(context);
    $(document.createElement("span")).attr({
        class: "context_attr"
    }).html("Novo Arquivo").on("click", (ev) => {
        $(".context-menu-file").remove();
        $("body").off("click");
        newFile(atob($(e.currentTarget).attr('data-path')));
    }).appendTo(context);
    $(document.createElement("span")).attr({
        class: "context_attr"
    }).html("Nova Pasta").on("click", (ev) => {
        $(".context-menu-file").remove();
        $("body").off("click");
        newFolder(atob($(e.currentTarget).attr('data-path')));
    }).appendTo(context);
    $(document.createElement("span")).attr({
        class: "context_attr"
    }).html("Remover").on("click", (ev) => {
        $(".context-menu-file").remove();
        $("body").off("click");
        removeFolder(e.currentTarget);
    }).appendTo(context);

    $("body").on("click", (ev) => {
        if($(ev.target).hasClass("context-menu-file")){
            return;
        }
        if($(ev.target).children(".context-menu-file").length > 0){
            return;
        }
        $(".context-menu-file").remove();
        $("body").off("click");
    })

}

function loadConfig(config_tab){

    let save = $(document.createElement("div"));
    save.addClass("config-item")
    save.html(`<i class='bx bxs-save' ></i>`);
    save.appendTo(config_tab);
    save.on("click", saveFile)

    let config = $(document.createElement("div"));
    config.addClass("config-item")
    config.html(`<i class='bx bxs-cog' ></i>`);
    config.appendTo(config_tab);
    config.on("click", ModelConfig)

    let newfile = $(document.createElement("div"));
    newfile.addClass("config-item")
    newfile.html(`<i class='bx bxs-file-plus' ></i>`);
    newfile.appendTo(config_tab);
    newfile.on("click", newFile)

    let newfolder = $(document.createElement("div"));
    newfolder.addClass("config-item")
    newfolder.html(`<i class='bx bxs-folder-plus' ></i>`);
    newfolder.appendTo(config_tab);
    newfolder.on("click", newFolder)

    let reload = $(document.createElement("div"));
    reload.addClass("config-item")
    reload.html(`<i class='bx bx-refresh'></i>`);
    reload.appendTo(config_tab);
    reload.on("click", reloadFiles)

}

function ModelConfig(){

    let bg = $(document.createElement("div")).css({
        "background-color": "rgba(0,0,0, 0.7)",
        position: "absolute",
        left: 0,
        rigth: 0,
        top: 0,
        bottom: 0,
        "z-index": 9999,
        height: "100vh",
        width: "100%"
    }).on("click", (e) => {
        if(e.currentTarget === e.target){
            $(e.currentTarget).remove();
        }
    }).appendTo("body");

    let div = $(document.createElement("div")).css({
        "background-color": "#21242D",
        position: "absolute",
        left: "25%",
        width: "50%",
        height: "50vh",
        top: "25vh",
        padding: "10px",
        color: "#fefefe"
    }).html("<h3>Configurações</h3><hr>").appendTo(bg);

    if($('.tab_files_editor_item.active[data-file^="ff_"]').length > 0){
        let form_language = $(document.createElement("div")).html(`
            <p>Linguagem do editor</p>
        `).appendTo(div);
        let select = $(document.createElement("select")).css({
            color: "#fefefe"
        }).addClass("form-select")
        .addClass("bg-dark").appendTo(form_language);
        let mode_id = $('.tab_files_editor_item.active[data-file^="ff_"]').attr("data-file");
        let mode = window.editor.get(mode_id).session.getMode().$id;
        for(let lang of window.language){
            let option = $(document.createElement("option")).attr({
                value: lang.mode
            }).css({
                color: "#fefefe"
            }).html(lang.text).appendTo(select);
            if(mode == lang.mode){
                option.attr("selected", true);
            }
        }
        select.on("change", (e) => {
            let mode_change = $(e.currentTarget).val();
            let mode_change_id = $('.tab_files_editor_item.active[data-file^="ff_"]').attr("data-file");
            window.editor.get(mode_change_id).session.setMode(mode_change);
        })
        $(document.createElement("hr")).appendTo(form_language);
    }
    const f = (e) => {
        let val = $(e.currentTarget).val();
        if(!isNaN(val)){
            if(window.editor.size > 0 && Number(val) > 14 && Number(val) < 30){
                window.user.fontsize = val;
                setOption("fontsize", window.user.fontsize);
                for(let d of window.editor){
                    d[1].setFontSize(Number(val))
                }
            }
        }
    }
    $(document.createElement("p")).html("Font-size").appendTo(div);
    $(document.createElement("input")).attr({
        class: "form-control bg-dark",
        type: "number"
    }).css({
        color: "#fefefe"
    }).val(window.user.fontsize).on('keyup', f).on("change", f).appendTo(div);
    $(document.createElement("hr")).appendTo(div);
    $(document.createElement("p")).html("Theme").appendTo(div);
    let select = $(document.createElement("select")).css({
        color: "#fefefe"
    }).addClass("form-select").addClass("bg-dark").appendTo(div);
    let co = 0;
    for(let theme of window.themes){
        let option = $(document.createElement("option")).attr({
            value: theme.theme
        }).css({
            color: "#fefefe"
        }).html(theme.name + (co >= 15 ? " ( Dark )" : " ( Light )")).appendTo(select);
        if(window.user.theme == theme.theme.split("/").pop()){
            option.attr("selected", true);
        }
        co++;
    }
    select.on("change", (e) => {
        let val = $(e.currentTarget).val();
        if(window.editor.size > 0){
            window.user.theme = val.split("/").pop();
            setOption("theme", window.user.theme);
            for(let d of window.editor){
                d[1].setTheme(val);
            }
        }
    })

}

async function setOption(type, value){
    return await $.ajax({
        url: "/api/user/preferences/set/"+type,
        data: {
            data: value
        }
    })
}

async function loadInterface(files){

    let folder_file_div = $(document.createElement("div"))
    folder_file_div.addClass("folder_files");
    let config_tab = $(document.createElement("div"));
    config_tab.attr({
        class: "config-tab"
    })
    loadConfig(config_tab);

    config_tab.appendTo(folder_file_div);

    for(let item of files.folder){
        id = "fc_"+RandomString();
        let filho = $(document.createElement("div"));
        filho.attr({
            class: "folder_file_filho",
            "data-index": 0,
            "data-path": btoa(item.path),
            "data-type": "folder",
            "data-id": id,
            "data-open": 0,
            "data-parent": "null",
            "title": item.path
        })
        filho.css({
            "padding-left": "1em"
        });
        icon = $(document.createElement("span"));
        icon.attr({
            class: "folder_file_icon"
        }).html("<i class='bx bxs-folder'></i>")
        text = $(document.createElement("span"));
        text.attr({
            class: "folder_file_name"
        }).text(item.name)
        icon.appendTo(filho);
        text.appendTo(filho);
        filho.on("click", async (e) => {
            let _this = e.currentTarget;
            await loadFolder(_this);
        })
        filho.on("contextmenu", contextFolderMenu);
        filho.appendTo(folder_file_div);
    }

    for(let item of files.file){
        id = "fc_"+RandomString();
        let filho = $(document.createElement("div"));
        filho.attr({
            class: "folder_file_filho",
            "data-index": 0,
            "data-path": btoa(item.path),
            "data-type": "file",
            "data-id": "ff_"+btoa(item.path),
            "data-intab": 0,
            "data-parent": "null",
            "title": item.path
        })
        filho.css({
            "padding-left": "1em"
        });
        icon = $(document.createElement("span"));
        icon.attr({
            class: "folder_file_icon"
        }).html("<i class='bx bxs-file'></i>")
        text = $(document.createElement("span"));
        text.attr({
            class: "folder_file_name"
        }).text(item.name)
        icon.appendTo(filho);
        text.appendTo(filho);
        filho.on("click", async (e) => {
            await loadFile(e.currentTarget);
        })
        filho.on("contextmenu", contextFileMenu)
        filho.appendTo(folder_file_div);
    }

    let editor_div = $(document.createElement("div"));
    editor_div.attr({
        class: "editor_div"
    });

    let editor_tab = $(document.createElement("div"));
    editor_tab.attr({
        class: "tab_files_editor_div"
    });

    let content_tabs = $(document.createElement("div"));
    content_tabs.attr({
        class: "tab_files_editor_group_content",
    });

    openDefaultTab(editor_div, content_tabs, editor_tab)

    folder_file_div.appendTo("body");
    editor_div.appendTo("body");

    $(".loader-div").remove();

}

function openDefaultTab(editor_div, content_tabs, editor_tab){

    let welcome_tab = $(document.createElement("div"));
    welcome_tab.attr({
        class: "tab_files_editor_item active",
        "data-file": "welcome",
        "title": "default://welcome"
    });

    let welcome_tab_close = $(document.createElement("span"));
    $(document.createElement("i")).attr({
        class: "bx bx-x"
    }).appendTo(welcome_tab_close);
    welcome_tab_close.attr({
        class: "tab_files_editor_item_close",
        "data-target": "welcome",
        "data-path": "default://welcome",
        "title": "Fechar"
    })
    welcome_tab_close.on("click", (e) => {
        closeTab(e.currentTarget);
    })

    welcome_tab.html(`<span class="tab-editor-icon">
        <i class='bx bx-news'></i>
    <span><span class='tab-editor-name'>Welcome</span>`);
    welcome_tab.on("click", (e) => {
        let _this = e.currentTarget;
        const element = $(_this).attr("data-file");
        $(".tab_files_editor_content").hide();
        $(".tab_files_editor_item.active").removeClass("active");
        $(_this).addClass("active");
        $(`[data-element="${element}"]`).show();
    });
    welcome_tab_close.appendTo(welcome_tab);

    let welcome_tab_content = $(document.createElement("div"));
    welcome_tab_content.attr({
        class: "tab_files_editor_content",
        "data-element": "welcome",
    });

    welcome_tab_content.html(`<div class="element-content-center"><p><i class='bx bxs-coffee'></i></p><p>Escolha um arquivo para editar</p></div>`)
    welcome_tab_content.appendTo(content_tabs);
    editor_tab.appendTo(editor_div);
    welcome_tab.appendTo(editor_tab)
    content_tabs.appendTo(editor_div);

}

function addTab(_this, path = false){

    let id = $(_this).attr("data-id");
    if(!path)
        path = $(_this).attr("data-path");
    let file_tab = $(document.createElement("div"));
    file_tab.attr({
        class: "tab_files_editor_item",
        "data-file": id,
        "title": atob(path)
    });
    let file_tab_close = $(document.createElement("span"));
    $(document.createElement("i")).attr({
        class: "bx bx-x"
    }).appendTo(file_tab_close);
    file_tab_close.attr({
        class: "tab_files_editor_item_close",
        "data-target": id,
        "data-path": path,
        "title": "Fechar"
    })
    file_tab_close.on("click", (e) => {
        closeTab(e.currentTarget);
    })
    file_tab.on("click", (e) => {
        let _this = e.currentTarget;
        const element = $(_this).attr("data-file");
        $(".tab_files_editor_content").hide();
        $(".tab_files_editor_item.active").removeClass("active");
        $(_this).addClass("active");
        $(`[data-element="${element}"]`).show();
    });
    let filename = getFileName(atob(path));
    let icontab = getIconFile(filename);
    let iconcolor = "";
    if(icontab.color !== false){
        iconcolor = ` style="color: ${icontab.color}"`;
    }
    file_tab.html(`<span class="tab-editor-icon">
        <i class='${icontab.icon}'${iconcolor}></i>
    <span><span class='tab-editor-name'>${filename}</span>`);
    file_tab_close.appendTo(file_tab);
    file_tab.appendTo(".tab_files_editor_div");

}

function getFileName(path){
    return path.split("/").pop().split("\\").pop();
}

async function closeTab(_this){

    const element = $(_this).attr("data-target");
    $(`[data-element="${element}"]`).remove();
    $(`[data-file="${element}"]`).remove();

    if($(".tab_files_editor_div div").length == 0){
        openDefaultTab($('.editor_div'), $(".tab_files_editor_group_content"), $(".tab_files_editor_div"));
    }else{
        $(".tab_files_editor_item:first-child").click();
    }

}

async function loadFile(_this){
    if($(_this).attr("data-type") != "file"){
        return;
    }
    let id = $(_this).attr("data-id");
    let path = $(_this).attr("data-path");
    if($(`[data-file="${id}"]`).length > 0){
        return;
    }
    let content = await loadContentFile(atob(path));
    $(".tab_files_editor_content").hide();
    addTab(_this, content.path);
    let welcome_tab_content = $(document.createElement("div"));
    welcome_tab_content.attr({
        class: "tab_files_editor_content p-absolute",
        "data-element": id,
    });
    welcome_tab_content.appendTo(".tab_files_editor_group_content");
    $(".tab_files_editor_item.active").removeClass("active");
    $(`[data-file="${id}"]`).addClass("active");
    let editor = ace.edit(document.querySelector(`[data-element="${id}"]`));
    editor.setTheme("ace/theme/" + (window.user.theme ?? "dracula"));
    editor.session.setMode("ace/mode/"+(await getLanguage(atob(path).split(".").pop())).name);
    editor.setFontSize(window.user.fontsize ?? 16);
    editor.setValue(content.content);
    window.editor.set(id, editor);
    
}

function getIconFile(filename){
    let ext = filename.split(".").pop();
    let icon = window.icons.find(e => e.ext.indexOf(ext) !== -1);
    if(!icon){
        return {
            icon: 'bx bx-news',
            color: false
        }
    }
    return icon;

}

async function loadFolder(_this){

    if($(_this).attr("data-type") != "folder"){
        return;
    }
    let id = $(_this).attr("data-id");
    let open = $(_this).attr("data-open");
    let index = apenasNumeros($(_this).attr("data-index") ?? "0");
    let parent = $(_this).attr("data-parent");
    let path = $(_this).attr("data-path");
    if(open != 0){
        $(`[data-parent*="${id}"]`).remove();
        $(_this).attr("data-open", "0");
        return;
    }
    let response = await $.ajax({
        url: "/api/list",
        data: {
            folder: atob(path)
        }
    });
    if(response.code == 500){
        alert("Houve um erro ao tentar obter sua lista de arquivos");
        return false;
    }
    let files = response.data;
    for(let item of files.folder){
        rid = "fc_"+RandomString();
        let filho = $(document.createElement("div"));
        filho.attr({
            class: "folder_file_filho",
            "data-index": index + 1,
            "data-path": btoa(item.path),
            "data-type": "folder",
            "data-id": rid,
            "data-open": 0,
            "data-parent": id + " " + parent,
            "title": item.path
        })
        filho.css({
            "padding-left": index + 2 + "em"
        });
        icon = $(document.createElement("span"));
        icon.attr({
            class: "folder_file_icon"
        }).html("<i class='bx bxs-folder'></i>")
        text = $(document.createElement("span"));
        text.attr({
            class: "folder_file_name"
        }).text(item.name)
        icon.appendTo(filho);
        text.appendTo(filho);
        filho.on("click", async (e) => {
            await loadFolder(e.currentTarget);
        })
        filho.on("contextmenu", contextFolderMenu)
        $(filho).insertAfter(_this);
    }

    for(let item of files.file){
        let filho = $(document.createElement("div"));
        filho.attr({
            class: "folder_file_filho",
            "data-index": index + 1,
            "data-path": btoa(item.path),
            "data-type": "file",
            "data-id": "ff_"+btoa(item.path),
            "data-intab": 0,
            "data-parent": id + " " + parent,
            "title": item.path
        })
        if($(`[data-file="ff_${btoa(item.path)}"]`).length > 0){
            filho.addClass("active");
        }
        filho.css({
            "padding-left": index + 2 + "em"
        });
        icon = $(document.createElement("span"));
        icon.attr({
            class: "folder_file_icon"
        }).html("<i class='bx bxs-file'></i>")
        text = $(document.createElement("span"));
        text.attr({
            class: "folder_file_name"
        }).text(item.name)
        icon.appendTo(filho);
        text.appendTo(filho);
        filho.on("click", async (e) => {
            await loadFile(e.currentTarget);
        })
        filho.on("contextmenu", contextFileMenu)
        filho.insertAfter(_this);
    }

    $(_this).attr("data-open", "1");

}

function apenasNumeros(string) 
{
    var numsStr = string.replace(/[^0-9]/g,'');
    return parseInt(numsStr);
}

function RandomString(tamanho = 12) {
    var stringAleatoria = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}


$(window).ready(async () => {

    // Incluir os arquivos
    ace.require("ace/ext/language_tools");
    let files = await loadPrincipalFiles();
    if(!files){
        return;
    }
    window.editor = new Map();
    await loadInterface(files);

    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            if(String.fromCharCode(event.which).toLowerCase() == "s"){
                event.preventDefault();
                saveFile();
            }
        }
    });

})