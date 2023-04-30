const fs = require('fs');
var dirJson = __dirname + '/json/users.json';
var dados = JSON.parse(fs.readFileSync(dirJson));

const conta = (sender, opcao) => {

const dataAtual = new Date();
dataAtual.setMinutes(dataAtual.getMinutes() + 15);
const horario = dataAtual.getHours().toString().padStart(2, '0') + ':' + dataAtual.getMinutes().toString().padStart(2, '0');

    let indice = false;
    let obj = {
        numero: sender,
        horario: horario,
        permissao: {
            menu: true,
            opcPrincipal: 0,
            submenu: false,
            opcSubmenu: 0
        }
      };
      Object.keys(dados).forEach((i) => {
        if (dados[i].numero === sender) {
            indice = i;
        };
      });
      if (opcao === "criar" && indice === false) {
        dados.push(obj);
        indice = true;
    } else if (opcao === "deletar" && indice !== false) {
        dados.splice(indice, 1);
        indice = true;
      } else if (opcao === "verificar") {
        return indice !== false;
    };
    fs.writeFileSync(dirJson, JSON.stringify(dados));
    return indice !== false;
};

const ver = (sender, opcao) => {
    let indice = false;
    Object.keys(dados).forEach((i) => {
        if (dados[i].numero === sender) {
            indice = i;
        };
    });
    console.log(typeof indice)
    if (typeof indice === 'boolean') return false;

    if (opcao === "menu") {
        return dados[indice].permissao.menu;
    } else if (opcao === "submenu") {
        return dados[indice].permissao.submenu;
    } else if (opcao === "opcmenu") {
        return dados[indice].permissao.opcPrincipal;
    } else if (opcao === "opcsubmenu") {
        return dados[indice].permissao.opcPrincipal;
    };
    return false;    
};

const set = (sender, opcao, valor) => {
    let indice = false;
    Object.keys(dados).forEach((i) => {
        if (dados[i].numero === sender) {
            indice = i;
        };
    });
    if (indice === false) return false;
    if (opcao === "menu") {
        dados[indice].permissao.menu = valor;
    } else if (opcao === "submenu") {
        dados[indice].permissao.submenu = valor;
    } else if (opcao === "opcmenu") {
        dados[indice].permissao.opcPrincipal = valor;
    } else if (opcao === "opcsubmenu") {
        dados[indice].permissao.opcPrincipal = valor;
    };
    fs.writeFileSync(dirJson, JSON.stringify(dados));
    return true;
    }

module.exports = { conta, ver, set };
