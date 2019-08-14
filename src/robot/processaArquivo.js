const importExcelOpecToJson = require('./importExcelOpecToJson');
const processaInformacao = require('./processaInformacao');

const Paths = require('../paths');

async function processaArquivo(path) {
    await importExcelOpecToJson(path);
    await processaInformacao();
    
}
module.exports = processaArquivo