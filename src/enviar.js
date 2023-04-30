const fs = require('fs');
var dirJson = __dirname + '/txt/menu.txt';
//var dados = JSON.parse(fs.readFileSync(dirJson));

const teste = () => {

    fs.readFile(dirJson, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
      
        const regex = /op2:\s*([\s\S]*?)(?=op\d|\n\n)/g;
        const match = regex.exec(data);
        
        if (match) {
          console.log(match[1].trim());
        } else {
          console.log('Opção não encontrada');
        }
      });
return true 
}
module.exports = { teste };