
const verificaArquivoVideo = require('./verificaArquivo');
const detectarBlackFrame = require('./detectarBlackFrame');
const verificaMarkInOut = require('./verificaMarkInOut');
const criaXML = require('./criaXML');

async function processaArquivo() {
    
    await verificaArquivoVideo();
    await detectarBlackFrame();
    await verificaMarkInOut();
    await criaXML();

    await sleep(600000);
    processaArquivo();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
}

module.exports = processaArquivo
