const fs =require('fs');
const state = require('../util/State');
const _ = require('lodash');

async function verificaArquivoVideoExiste() {
  try {
    var content = {};
    console.log('Iniciado verificaArquivoVideoExiste');
    content = await state.load();
    if (!content.materiais) content.materiais = [];
     
    let materiais =_.filter(content.materiais, (material) => { return !material.ARQUIVO_EXISTE;}) 

    for([idx,value] of materiais.entries()) {
      //console.log(`Indice no Array: ${idx}`);
      var { MATERIAL, TITULO, OBSERVACAO } = value;
      try{

        var nomeArquivoVideo = `${MATERIAL}_${TITULO}`;
        var arquivoVideo = `${nomeArquivoVideo}.mxf`;
        var existeArquivo = await fs.existsSync(`${OBSERVACAO}\\${arquivoVideo}`);
        if (existeArquivo) {
            const novo_Item = {...value, "ARQUIVO_EXISTE": true }
            _.remove(content.materiais,(material) => {
                return material.MATERIAL == value.MATERIAL;
            });
            content.materiais.push(novo_Item);
            state.save(content);
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

module.exports = verificaArquivoVideoExiste   
