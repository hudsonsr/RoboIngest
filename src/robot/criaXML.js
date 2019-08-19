var convert = require('xml-js');
const { escreverArquivo } = require('../util/manipulaArquivo');
const paths = require('../paths');

const xmlOptions = {
  header: '<?xml version="1.0" encoding="iso-8859-1"?>' ,
  spaces: 4
};
  
async function criaXML(nomeArquivo, contentJson){
  //console.log(contentJson);
  let resultado = convert.json2xml(contentJson,{compact: true, spaces: xmlOptions.spaces});
  //console.log(`O resultado da conversão foi: ${xmlOptions.header}\n ${resultado}`);
   return await escreverArquivo(`${paths.PATH_ARQUIVO_XML}\\${nomeArquivo}.xml`,`${xmlOptions.header}\n${resultado}`,'utf8');
}

module.exports = criaXML;

/*
const { toXML } = require('jstoxml');
const { escreverArquivo } = require('../util/manipulaArquivo');
const paths = require('../paths');

const xmlOptions = {
  header: '<?xml version="1.0" encoding="iso-8859-1"?>' ,
  indent: '  '
};
  
async function criaXML(nomeArquivo, contentJson){
   return await escreverArquivo(`${paths.PATH_ARQUIVO_XML}\\${nomeArquivo}.xml`,toXML(contentJson,xmlOptions),'utf8');
}

module.exports = criaXML;
*/