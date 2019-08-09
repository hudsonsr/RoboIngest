const fs = require('fs');
const XLSX = require('xlsx');
const util = require('util');
const state = require('./State');

async function importExcelOpecToJson(caminhoArquivoExcel){
  console.log('1');
  var buf = await fs.readFileSync(caminhoArquivoExcel);
  console.log('2');
  var wb = XLSX.read(buf, {type:'buffer'});
 
  console.log('3');
  //console.log(wb.Sheets.Sheet1);
  let jsonSheet = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1);
  console.log('4');
  //console.log(jsonSheet);
  
  var content = {};
  try{  content = await state.load();  }catch(err){}
  
  if (!content.materiais) content.materiais = [];
  console.log(`registro remanescentes: ${content.materiais.length}`);
  const Retorna_JsonToContent = util.promisify(RetornaJsonToContent);
  (async () =>{
    await Retorna_JsonToContent(content, jsonSheet);
   })();
   console.log(`Total de registro: ${content.materiais.length}`);
  state.save(content);
  console.log('7');
   
  function retornaConteudo(objeto){
    if(objeto) return String(objeto);
    return "";
  }

  function retornaRegistroJSON(linhas){
    return {
      "DIG": retornaConteudo(linhas.__EMPTY),
      "MATERIAL": retornaConteudo(linhas.__EMPTY_1),
      "TITULO": retornaConteudo(linhas.__EMPTY_2),
      "CLIENTE": retornaConteudo(linhas.__EMPTY_3),
      "AGENCIA": retornaConteudo(linhas.__EMPTY_4),
      "DUR": retornaConteudo(linhas.__EMPTY_5),
      "OBSERVACAO": retornaConteudo(linhas.__EMPTY_6),
      "COORDENADOR": retornaConteudo(linhas.__EMPTY_7)
    };
  }

  function registroNaoExiste(content, codigoMaterial){
    var result = content.materiais.filter(function (item) {
      return item["MATERIAL"] == codigoMaterial;
    });
    if (result.length == 0) {
      return true;
    }else{
      return false;
    }
  }
  function inicioDados(linhas){
    if (linhas.__EMPTY == 'DIG') return true;
    return false;
  }

  function RetornaJsonToContent(content,jsonSheet){
    
    try{
      var processaElemento = false;
      var linhas='';
      jsonSheet.forEach(function (tabela) {
        linhas = JSON.stringify(tabela, 2, 2)
        linhas = JSON.parse(linhas);
        if (processaElemento) {
          if (registroNaoExiste(content,retornaConteudo(linhas.__EMPTY_1))){
            content.materiais.push(retornaRegistroJSON(linhas));
          }
        }else{
          processaElemento = inicioDados(linhas); 
        }
      });
      console.log('5');
    } catch(err){
      console.log(`6: ${err}`);
      return {}
    }
  }  
}

module.exports =   importExcelOpecToJson   
