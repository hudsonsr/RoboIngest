const importExcelOpecToJson = require('./importExcelOpecToJson');
const processaInformacao = require('./processaInformacao');
const { moverArquivo } = require('./manipulaArquivo');
const Paths = require('../paths');

async function processaArquivo(path) {
    //await importExcelOpecToJson(path);
   
    //await moverArquivo(path, Paths.PATH_ARQUIVO_EXCEL_PROCESSADO)

    await processaInformacao();
}
module.exports = processaArquivo