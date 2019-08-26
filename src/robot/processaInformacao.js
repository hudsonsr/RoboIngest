const fs =require('fs');
const state = require('../util/State');
const _ = require('lodash');
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
      let { MATERIAL, TITULO, OBSERVACAO } = value;
      let nomeArquivoVideo = `${MATERIAL}_${TITULO}`;
      let arquivoVideo = `${nomeArquivoVideo}.mxf`;
      //console.log(`Arquivo ${video}`);
      if (fs.existsSync(`${OBSERVACAO}\\${arquivoVideo}`)) {
        console.log(`Arquivo ${arquivoVideo}`);
        //+++++++++++++++++++
        try{
          await detectarBlackFrame(`${OBSERVACAO}\\${arquivoVideo}`);
          //PEGAR INICIO E FIM DO VÍDEO 
          console.log(`começou blackFilter. ${nomeArquivoVideo}`);
          await blackFilter(`${nomeArquivoVideo}.txt`).then((ret) =>{
            filtroBlack = ret;
            // console.log(`terminou blackFilter. ${nomeArquivoVideo}`)
            if(filtroBlack.markIn){
              (async () => {
                await criaXML(nomeArquivoVideo, infoVideoToJSON(value,filtroBlack.markIn, filtroBlack.markOut));
              })();
            }
            
            //REMOVER ELEMENTO DA LISTA
            //+++++++++++++++++++
            _.remove(content.materiais,(material) => {
              return material.MATERIAL == value.MATERIAL;
            });
          });
        } catch(err2){
          console.log(`${nomeArquivoVideo}: ${err2}`);
        }
      };
      cont += 1;
    }
    state.save(content);
    
  } catch (err) {
    console.log(err);
  }

  function infoVideoToJSON(infoVideo, markIn, markOut, remover = 0){
    let { DIG,MATERIAL, TITULO, OBSERVACAO } = infoVideo;
    return {
      video: {
          codigo: DIG,
          arquivo: `${OBSERVACAO}\\${MATERIAL}_${TITULO}.mxf`,
          titulo: TITULO,
          grupo: "Comerciais",
          operador: "automatico",
          markIn,
          markOut,
          remover
      }
    }
  }
}

module.exports = processaInformacao   
