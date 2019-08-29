const chokidar = require('chokidar');
const paths = require('./src/paths.js');
const processaArquivo = require('./src/robot/processaArquivoExcel');
const processaInformacoes = require('./src/robot/processaInformacoes');
const executaArquivoPendente = require('./src/robot/executaArquivoPendente');
const enviaEmail = require('./src/robot/EnviaEmail');
const watcherArquivoOpec = chokidar.watch(paths.PATH_ARQUIVO_EXCEL, {ignored: /^\./, persistent: true, usePolling: true, depth:0, awaitWriteFinish: {stabilityThreshold: 2000,pollInterval: 100}, });
const watcherArquivoFloripa = chokidar.watch(paths.PATH_ARQUIVO_FLORIPA, {ignored: /^\./, persistent: true});


const state = require('./src/util/State');

async function Start(){
	
	console.log('antes processa arquivo');
	content = await state.load();
	//console.dir(content);

	await executaArquivoPendente()
	
	console.log('entre processa arquivo e watcherArquivoOpec');
    watcherArquivoOpec
		.unwatch(`${paths.PATH_ARQUIVO_EXCEL_PROCESSADO}`)
		.unwatch(`${paths.PATH_ARQUIVO_XML}`)
		.unwatch(`${paths.PATH_ARQUIVO_FLORIPA}`)
		.unwatch(`${paths.PATH_ARQUIVO_BLACKFILTER}`)
		.on('ready', function() {
			watching = true;
		})
		.on('change', async function(path) {
			console.log('watcherArquivoOpec:File', path, 'has been changed'); 
			try{
				if (!watching){
					let arquivos = {arquivo:[]};
					arquivos = await state.load('./arquivo.json');
					if (!arquivos.arquivo) arquivos.arquivo = [];
					arquivos.arquivo.push(path);
					await state.save(arquivos,'./arquivo.json')
					return;
				} 
			
				watching = false;
				await processaArquivo(path);
				watching = true;
			}catch(err){
				await processaArquivo(path);
			}
		})
		.on('add', async function(path) {
			console.log('watcherArquivoOpec:File', path, 'has been added'); 
			try{
				if (!watching){
					let arquivos = {arquivo:[]};
					arquivos = await state.load('./arquivo.json');
					if (!arquivos.arquivo) arquivos.arquivo = [];
					arquivos.arquivo.push({path});
					await state.save(arquivos,'./arquivo.json')
					return;
				} 
			
				watching = false;
				await processaArquivo(path);
				watching = true;
			}catch(err){
				await processaArquivo(path);
			}
		})
		.on('unlink', async function(path) {
			console.log('watcherArquivoOpec:File', path, 'has been removed');
			await executaArquivoPendente();
			await processaInformacoes();
		})
		.on('error', async function(error) {
			await executaArquivoPendente();
			await processaInformacoes();
		})
		
		console.log('entre watcherArquivoOpec e watcherArquivoFloripa');
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
		console.log('depois watcherArquivoFloripa');
}

 Start();
