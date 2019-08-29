const fs = require('fs');
const XLSX = require('xlsx');
const util = require('util');
const state = require('../util/State');
const Paths = require('../paths');
const { moverArquivo } = require('../util/manipulaArquivo');

async function importExcelOpecToJson(caminhoArquivoExcel, pathContent) {
    try {
    var buf = await fs.readFileSync(caminhoArquivoExcel);
    var wb = XLSX.read(buf, { type: 'buffer' });
 
    let jsonSheet = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1);
    
    
    var content = {};
    content = await state.load(pathContent); 

    if (!content.materiais) content.materiais = [];
    console.log(`registro remanescentes: ${content.materiais.length}`);
    const Retorna_JsonToContent = util.promisify(RetornaJsonToContent);
    (async () => {
      await Retorna_JsonToContent(content, jsonSheet);
    })();
    console.log(`Total de registro: ${content.materiais.length}`);
    state.save(content,pathContent);
    await moverArquivo(caminhoArquivoExcel, Paths.PATH_ARQUIVO_EXCEL_PROCESSADO);
  } catch (err) { 
    //console.log(caminhoArquivoExcel);
    //console.log(err);
  }

  function retornaConteudo(objeto) {
    if (objeto) return String(objeto);
    return "";
  }

  function retornaRegistroJSON(linhas) {
    return {
      "DIG": retornaConteudo(linhas.__EMPTY),
      "MATERIAL": retornaConteudo(linhas.__EMPTY_1),
      "TITULO": retornaConteudo(linhas.__EMPTY_2),
      "CLIENTE": retornaConteudo(linhas.__EMPTY_3),
      "AGENCIA": retornaConteudo(linhas.__EMPTY_4),
      "DUR": retornaConteudo(linhas.__EMPTY_5),
      "OBSERVACAO": retornaConteudo(linhas.__EMPTY_6),
      "COORDENADOR": retornaConteudo(linhas.__EMPTY_7),
      "ARQUIVO_EXISTE": false,
      "ARQUIVO_PROCESSADO": false,
      "MARKIN": 0,
      "MARKOUT": 0
    };
  }

  function registroExiste(content, codigoMaterial) {
    var result = content.materiais.filter(function (item) {
      return item["MATERIAL"] == codigoMaterial;
    });
    if (result.length == 0) {
      return false;
    } 
    return true;
  }

  function inicioDados(linhas) {
    if (linhas.__EMPTY == 'DIG') return true;
    return false;
  }

  function RetornaJsonToContent(content, jsonSheet) {
    try {
      var processaElemento = false;
      var linhas = '';
      jsonSheet.forEach(function (tabela) {
        linhas = JSON.stringify(tabela, 2, 2)
        linhas = JSON.parse(linhas);
        if (processaElemento) {
          if (!registroExiste(content, retornaConteudo(linhas.__EMPTY_1))) {
            content.materiais.push(retornaRegistroJSON(linhas));
          }
        } else {
          processaElemento = inicioDados(linhas);
        }
      });
    } catch (err) {
      console.log(`${err}`);
      return {}
    }
  }
}

module.exports = importExcelOpecToJson   
