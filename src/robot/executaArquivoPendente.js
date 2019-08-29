const fs =require('fs');
const _ = require('lodash');
const state = require('../util/State');
const importExcelOpecToJson = require('./importExcelOpecToJson');

async function ExecutaArquivoPendente() {
  try {
    var arquivo = {};
    console.log('Iniciado ExecutaArquivoPendente');
    arquivo = await state.load('./arquivo.json');
    if (!arquivo.arquivo) arquivo.arquivo = [];
     
    let arquivos =_.clone(arquivo.arquivo); 

    for([idx,value] of arquivos.entries()) {
      try{
        let path = value.path;
        let existeArquivo = await fs.existsSync(`${path}`);
        if (existeArquivo) {
             await importExcelOpecToJson(path);
            _.remove(arquivo.arquivo,(arq) => {
                return arq.path == value.path;
            });
            state.save(arquivo,'./arquivo.json');
        }else{
          _.remove(arquivo.arquivo,(arq) => {
            return arq.path == value.path;
          });
          state.save(arquivo,'./arquivo.json');
        };
        }catch(err){
            console.log(`erro ao verifica a existencia do arquivo: ${arquivoVideo}`);
        }
    }
    console.log('Finalizado');
    return true;
  
  } catch (err) {
    console.log(err);
  }
}

module.exports = ExecutaArquivoPendente   
