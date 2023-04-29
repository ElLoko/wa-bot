const fs = require('fs');
var dados = JSON.parse(fs.readFileSync(__dirname + '/src/json/user.json'));

const conta = (sender, opcao) => {
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
            indice = i
        }
      });
      if (opcao === "criar" && indice === false) {
        dados.push(obj);
      } else if (opcao === "deletar" && indice !== false) {
        dados.splice(indice, 1)
      } else if (opcao === "verificar") {
        return indice !== false
      }
      fs.writeFileSync(__dirname + './src/json/users.json', JSON.stringify(dados));
      return true
    // CRIAR
    // DELETAR
    // VERIFICAR
}

module.exports = { criar, verificar, opcao, deletar };
