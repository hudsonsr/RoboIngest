const fs =require('fs');
const state = require('../util/State');
const _ = require('lodash');
const { arquivoExiste } = require('../util/manipulaArquivo');
const path = require('../paths');
const detectarBlackFrame = require('./detectarBlackFrame');
const { blackFilter } = require('./blackFilter');
const criaXML = require('./criaXML');

async function processaInformacao() {
  try {
    var content = {};
    var filtroBlack={};
    
    content = await state.load();
    var cont = 0;
    if (!content.materiais) content.materiais = [];
    var materiais= content.materiais;
    //console.log(materiais.length);
    
    for([idx,value] of materiais.entries()) {
      // console.log(JSON.stringify(value));
      let nomeArquivoVideo = `${value.MATERIAL}_${value.TITULO}`;
      let arquivoVideo = `${nomeArquivoVideo}.mxf`;
      //console.log(`Arquivo ${video}`);
      if (fs.existsSync(`${path.PATH_VIDEO_BASE}\\${arquivoVideo}`)) {
        console.log(`Arquivo ${arquivoVideo}`);
        //+++++++++++++++++++
        //IMPLEMENTAR OUTROS TRABALHOS
        await detectarBlackFrame(arquivoVideo);
        //PEGAR INICIO E FIM DO VÍDEO 
        try{
          console.log(`começou blackFilter. ${nomeArquivoVideo}`);
            await blackFilter(`${arquivoVideo}.txt`).then((ret) =>{
            filtroBlack = ret;
          });
          console.log(`terminou blackFilter. ${nomeArquivoVideo}`)
        } catch(err2){
          console.log(`Erro ao Verificar Black: ${nomeArquivoVideo} - ${err2}`);
        }
        
        //MONTAR XML NO FORMATO DO FLORIPA
        try{console.log('1');
await criaXML(nomeArquivoVideo, infoVideoToJSON(value,filtroBlack.markIn, filtroBlack.markOut));
console.log('2');
        }catch(err){
          console.log(err);
        }
        
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
    console.log(err);
  }

  function infoVideoToJSON(infoVideo, markIn, markOut, remover = 0){
    return {
      video: {
          codigo: infoVideo.MATERIAL,
          arquivo: infoVideo.MATERIAL+'_'+infoVideo.TITULO,
          titulo: infoVideo.TITULO,
          grupo: "Opec",
          operador: "CHAPPIE",
          markIn,
          markOut,
          remover
      }
    }
  }
}

module.exports = processaInformacao   
