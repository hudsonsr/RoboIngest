const chokidar = require('chokidar');
const Tipos = require('./src/paths.js');
const watcherVideoOriginal = chokidar.watch(Tipos.PATH_ARQUIVO_EXCEL, {ignored: /^\./, persistent: true});
const processaArquivo = require('./src/robot/processaArquivo');

async function Start(){

    watcherVideoOriginal
		.unwatch(`${Tipos.PATH_VIDEO_BASE}\\pronto`)
		.unwatch(`${Tipos.PATH_ARQUIVO_EXCEL_PROCESSADO}`)
		.unwatch(Tipos.PATH_ARQUIVO_BLACK)
		.on('change', function(path) {
			console.log('watcherVideoOriginal:File', path, 'has been changed'); 
            processaArquivo(path);
		})
		.on('add', function(path) {
			console.log('watcherVideoOriginal:File', path, 'has been added'); 
			processaArquivo(path);
		})
		.on('unlink', function(path) {console.log('watcherVideoOriginal:File', path, 'has been removed');})
		.on('error', function(error) {console.error('watcherVideoOriginal:Error happened', error);})

}

 Start();
