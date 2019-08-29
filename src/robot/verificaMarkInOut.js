const fs = require('fs');
const _ = require('lodash');
const state = require('../util/State');
const paths = require('../paths');
const { existeItemNoArray } = require('../util/manipulaArquivo');

async function verificaMarkInOut() {
  try {
    let content = {};
    console.log('Iniciado verificaMarkInOut');
    content = await state.load();
    if (!content.materiais) content.materiais = [];
    
    let materiais =_.filter(content.materiais, { 'ARQUIVO_EXISTE': true, 'ARQUIVO_PROCESSADO': true, "MARKIN":0 }) 

    for([idx,value] of materiais.entries()) {
      let valores = value;
      let { MATERIAL, TITULO } = valores;
      let nomeArquivoVideo = `${MATERIAL}_${TITULO}`;
      
      if(!existeItemNoArray(content.materiais,  { 'MATERIAL': MATERIAL, 'ARQUIVO_PROCESSADO': true, "MARKIN":0 })) continue;
      
      try{
        const retorno = await blackFilter(`${nomeArquivoVideo}.txt`)
        
        if(retorno.markIn && retorno.markOut){
          const novo_Item = {...valores, "MARKIN": retorno.markIn, "MARKOUT": retorno.markOut }
          //console.log(novo_Item);
          _.remove(content.materiais,(material) => { return material.MATERIAL == value.MATERIAL; });
          content.materiais.push(novo_Item);
          state.save(content);
        }
      } catch(err2){
          const novo_Item = {...valores, 'ARQUIVO_PROCESSADO': false, "MARKIN": 0, "MARKOUT": 0 }
          //console.log(novo_Item);
          _.remove(content.materiais,(material) => { return material.MATERIAL == value.MATERIAL; });
          content.materiais.push(novo_Item);
          state.save(content);
        console.log(`${nomeArquivoVideo}: ${err2}`);
      }
    }
    console.log('Finalizado');
  } catch (err) {
    console.log(err);
    console.log('Finalizado');
  }

  
  async function blackFilter(nomeArquivo) {
    return new Promise((resolve, reject) => {
        try{
            const dados = fs.readFileSync(`${paths.PATH_ARQUIVO_BLACKFILTER}\\${nomeArquivo}`, {encoding:'utf8'});
                let retorno = dados.split('\r\n');
              // console.log(retorno);
                let retorno2 = _.uniq(retorno);
              
                let linha ='';
                let valorInicial = 0;
                let valorFinal = 0;
                let tagRetorno = {};

                for([idx,value] of retorno2.entries()) {
                  linha=value.split('=');
                  // console.log(linha);
                  if(_.first(linha)=='TAG:lavfi.black_start')  valorInicial = eval(_.takeRight(linha));
                  
                  if(_.first(linha)=='TAG:lavfi.black_end') valorFinal = eval(_.takeRight(linha));
                  
                  if((valorFinal>0) && (valorInicial>0)){
                    if((valorFinal-valorInicial)< 1.1) {
                      console.log(`blackFrame Detectado: ${valorInicial}`);
                      valorInicial = 0;
                      valorFinal = 0;
                    } else {
                      tagRetorno.markIn = timeToFrame(valorFinal);
                    }
                    valorInicial = 0;
                    valorFinal = 0;
                  }
                }

                if(valorInicial>0){
                  tagRetorno.markOut = timeToFrame(valorInicial)-1;
                } 
                resolve(tagRetorno);
           
        } catch(err){
            reject(`Erro ao ler arquivo: ${nomeArquivo} - erro: ${err}`);
        }
  });
  }
 function timeToFrame(time){
      return Math.round(time*29.97);
  }


}

module.exports = verificaMarkInOut   
