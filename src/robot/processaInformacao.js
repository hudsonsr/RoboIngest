const state = require('../util/State');
const { arquivoExiste } = require('../util/manipulaArquivo');
const path = require('../paths');
const fs =require('fs');
const _ = require('lodash');
async function processaInformacao() {
  try {
    var content = {};
    content = await state.load();
    var cont = 0;
    if (!content.materiais) content.materiais = [];
    var materiais= content.materiais;
    //console.log(materiais.length);
    for([idx,value] of materiais.entries()) {
     // console.log(JSON.stringify(value));
      let video = `${path.PATH_VIDEO_BASE}\\${value.MATERIAL}_${value.TITULO}.mxf`;
      //console.log(`Arquivo ${video}`);
      if (fs.existsSync(video)) {
        console.log(`Arquivo ${video}`);
        console.log(value.MATERIAL);
       
        //+++++++++++++++++++
        //IMPLEMENTAR OUTROS TRABALHOS
        //PEGAR INICIO E FIM DO VÍDEOno
        //MONTAR XML NO FORMATO DO FLORIPA
        //REMOVER ELEMENTO DA LISTA
        //+++++++++++++++++++
        _.remove(content.materiais,(material) => {
          return material.MATERIAL == value.MATERIAL;
        });
      };
      cont += 1;
    }
    state.save(content);
  } catch (err) {
    //console.log(err);
  }

}

module.exports = processaInformacao   
