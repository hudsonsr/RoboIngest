const fs =require('fs');
const convert = require('xml-js');
const _ = require('lodash');
const state = require('../util/State');
const { escreverArquivo } = require('../util/manipulaArquivo');
const paths = require('../paths');

const xmlOptions = {
  header: '<?xml version="1.0" encoding="iso-8859-1"?>' ,
  spaces: 4
};
  

async function criaXML() {
  try {
    
    var content = {};
    console.log('Iniciado CriaXML');
    content = await state.load();
    var cont = 0;
    if (!content.materiais) content.materiais = [];
    let materiais =_.filter(content.materiais, function(material)  { return  material.MARKIN > 0 }); 
    
    for([idx,value] of materiais.entries()) {
      var { MATERIAL, TITULO } = value;
      var nomeArquivoVideo = `${MATERIAL}_${TITULO}`;
      //(async () => {
      await escreveXML(nomeArquivoVideo, infoVideoToJSON(value));
      //})();
      state.save(content);
    } 
    console.log('Finalizado');
    return true;
  }catch (err) {
    console.log(err);
    console.log('Finalizado');
  }

  async function escreveXML(nomeArquivo, contentJson){
    //console.log(contentJson);
    let resultado = convert.json2xml(contentJson,{compact: true, spaces: xmlOptions.spaces});
    //console.log(`O resultado da conversão foi: ${xmlOptions.header}\n ${resultado}`);
     return await escreverArquivo(`${paths.PATH_ARQUIVO_XML}\\${nomeArquivo}.xml`,`${xmlOptions.header}\n${resultado}`,'utf8');
  }

  function infoVideoToJSON(infoVideo, markIn, markOut, remover = 0){
    let { DIG,MATERIAL, TITULO, OBSERVACAO, MARKIN, MARKOUT } = infoVideo;
    return {
      video: {
          codigo: DIG,
          arquivo: `${OBSERVACAO}\\${MATERIAL}_${TITULO}.mxf`,
          titulo: TITULO,
          grupo: "Comerciais",
          operador: "automatico",
          markIn: MARKIN,
          markOut: MARKOUT,
          remover
      }
    }
  }

}

module.exports = criaXML;
