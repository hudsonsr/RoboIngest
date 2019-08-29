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
    console.log('Iniciado');
    content = await state.load();
    var cont = 0;
    if (!content.materiais) content.materiais = [];
    var materiais = _.clone(content.materiais);
    //console.log(materiais.length);
    
    for([idx,value] of materiais.entries()) {
      //console.log(`Indice no Array: ${idx}`);
      console.log(value.OBSERVACAO);
      var valores = value;
      var { MATERIAL, TITULO, OBSERVACAO } = valores;
      var nomeArquivoVideo = `${MATERIAL}_${TITULO}`;
      var arquivoVideo = `${nomeArquivoVideo}.mxf`;
      //console.log(`Arquivo ${video}`);
      var existeArquivo = await fs.existsSync(`${OBSERVACAO}\\${arquivoVideo}`);
      console.log(`Arquivo ${arquivoVideo} - ${existeArquivo}`);
      if (existeArquivo) {
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
                await criaXML(nomeArquivoVideo, infoVideoToJSON(valores,filtroBlack.markIn, filtroBlack.markOut));
              })();
            }
            
            //REMOVER ELEMENTO DA LISTA
            //+++++++++++++++++++
            _.remove(content.materiais,(material) => {
              return material.MATERIAL == valores.MATERIAL;
            });
          });
        } catch(err2){
          console.log(`${nomeArquivoVideo}: ${err2}`);
        }
      };
   
    state.save(content);
    console.log('Finalizado');
    return true;
  }
  } catch (err) {
    console.log(err);
  }
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


module.exports = processaInformacao   
