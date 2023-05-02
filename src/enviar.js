const fs = require('fs');
var dirTexto = __dirname + '/txt/menu.txt';
//filePath


  const opcoes = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(dirTexto, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const regex = /op\d+:\s*/g;
          const matches = data.match(regex);
  
          if (matches) {
            resolve(matches.length);
          } else {
            resolve(0);
          }
        }
      });
    });
  };

const texto =  (sock, numero, opcao) => {
    fs.readFile(dirTexto, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const menu = opcao.includes("menu")
        const regex = menu ? new RegExp(`menu:\\s*([\\s\\S]*?)(?=op\\d|\\n\\n)`, 'g') : new RegExp(`op${opcao}:\\s*([\\s\\S]*?)(?=op\\d|\\n\\n)`, 'g');
        const match = regex.exec(data);
        
        if (match) {
          sock.sendMessage(numero, {text: match[1].trim()})
          if (menu) return
          setTimeout(() => {
            sock.sendMessage(numero, {text: "Digite *0* para voltar"})
          }, 2000);
        } else {
          //sock.sendMessage(numero, {text: 'Opção não encontrada'});
        }
      });
return true 
}

module.exports = { texto, opcoes };
