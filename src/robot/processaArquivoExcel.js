const importExcelOpecToJson = require('./importExcelOpecToJson');
/*const verificaArquivoExcel = require('./verificaArquivo');
const detectarBlackFrame = require('./detectarBlackFrame');
const verificaMarkInOut = require('./verificaMarkInOut');
const criaXML = require('./criaXML');*/

const Paths = require('../paths');

async function processaArquivo(path) {
    
   let continua = await importExcelOpecToJson(path);
   return continua;
}

module.exports = processaArquivo
