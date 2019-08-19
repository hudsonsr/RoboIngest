const chokidar = require('chokidar');
const paths = require('./src/paths.js');
const processaArquivo = require('./src/robot/processaArquivo');
const enviaEmail = require('./src/robot/EnviaEmail');
const watcherArquivoOpec = chokidar.watch(paths.PATH_ARQUIVO_EXCEL, {ignored: /^\./, persistent: false, usePolling: true, depth:0, awaitWriteFinish:true });
const watcherArquivoFloripa = chokidar.watch(paths.PATH_ARQUIVO_FLORIPA, {ignored: /^\./, persistent: true});
const processaInformacao = require('./src/robot/processaInformacao');

async function Start(){
	await processaInformacao();
    watcherArquivoOpec
		.unwatch(`${paths.PATH_ARQUIVO_EXCEL_PROCESSADO}`)
		.unwatch(`${paths.PATH_ARQUIVO_XML}`)
		.unwatch(`${paths.PATH_ARQUIVO_FLORIPA}`)
		.unwatch(`${paths.PATH_ARQUIVO_BLACKFILTER}`)
		.on('change', function(path) {
			console.log('watcherArquivoOpec:File', path, 'has been changed'); 
            processaArquivo(path);
		})
		.on('add', function(path) {
			console.log('watcherArquivoOpec:File', path, 'has been added'); 
			processaArquivo(path);
		})
		.on('unlink', function(path) {console.log('watcherArquivoOpec:File', path, 'has been removed');})
		.on('error', function(error) {console.error('watcherArquivoOpec:Error happened', error);})

	watcherArquivoFloripa
		.on('change', function(path) {
			console.log('watcherArquivoFloripa:File', path, 'has been changed'); 
		})
		.on('add', function(path) {
			console.log('watcherArquivoFloripa:File', path, 'has been added'); 
			enviaEmail('Teste de retorno Floripa','<b>Hello world?</b>');
		})
		.on('unlink', function(path) {console.log('watcherArquivoFloripa:File', path, 'has been removed');})
		.on('error', function(error) {console.error('watcherArquivoFloripa:Error happened', error);})

}

 Start();
