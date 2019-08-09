var XLSX= require('xlsx');
var fs = require('fs');
const state = require('./State.js.js')


function retornaConteudo(objeto){
  if(objeto) return String(objeto);
  return "";
}

function lerExcel(caminhoArquivoExcel){
    var buf = fs.readFileSync(caminhoArquivoExcel);
    var wb = XLSX.read(buf, {type:'buffer'});
    //console.log(wb.Sheets.Sheet1);
    let planilha = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1);
    //console.log(planilha);
    var processaElemento = false;
    const content = state.load();
    if(!content.materiais) content.materiais=[];
    try{
      var lerExcel1 = async function(planilha,processaElement){
        
        var processaElemen = processaElement;
        planilha.forEach(function(tabela){
          var linhas = JSON.stringify(tabela, 2, 2)
          linhas=JSON.parse(linhas);
          if (processaElemen){
            let registro = {
              "DIG": retornaConteudo(linhas.__EMPTY),
              "MATERIAL": retornaConteudo(linhas.__EMPTY_1),
              "TITULO": retornaConteudo(linhas.__EMPTY_2),
              "CLIENTE": retornaConteudo(linhas.__EMPTY_3),
              "AGENCIA": retornaConteudo(linhas.__EMPTY_4),
              "DUR": retornaConteudo(linhas.__EMPTY_5),
              "OBSERVACAO": retornaConteudo(linhas.__EMPTY_6),
              "COORDENADOR": retornaConteudo(linhas.__EMPTY_7)
            };
            var result = content.materiais.filter(function(item) {
              console.log(item["MATERIAL"]);
              return item["MATERIAL"] == retornaConteudo(linhas.__EMPTY_1);
            });
            if(result.length==0){ 
              content.materiais.push(registro);
            }
          }
          if(linhas.__EMPTY=='DIG' || processaElemen) processaElemen = true; 
        });
      };
       await lerExcel1(planilha,processaElemento);
       state.save(content);
    } catch(err){
      console.log(`Erro ao Ler arquivo: ${caminhoArquivoExcel}`);
      return false;
    }
    
}

module.exports =  { lerExcel };
