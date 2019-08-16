var fs = require('fs');
var _ = require('lodash');
const paths = require('../paths');

async function blackFilter(nomeArquivo) {
    return new Promise((resolve, reject) => {
        try{
            fs.readFile(`${paths.PATH_ARQUIVO_BLACK}\\${nomeArquivo}`,'utf8', function(err,data){
                if(err) {
                    console.error("Could not open file: %s", err);
                   // return reject(err);
                }
                let retorno = data.split('\r\n');
               // console.log(retorno);
                let retorno2 = _.uniq(retorno);
                //console.log('===============');
                //console.log(retorno2);

                let linha ='';
                let valorInicial = 0;
                let valorFinal = 0;
                var tagRetorno = {};

                _.forEach(retorno2, function(value, key) { 
                    linha=value.split('=');
                    // console.log(linha);
                    if(_.first(linha)=='TAG:lavfi.black_start'){
                        valorInicial = eval(_.takeRight(linha));
                    }
                    if(_.first(linha)=='TAG:lavfi.black_end'){
                        valorFinal = eval(_.takeRight(linha));
                    }
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
                    //console.log(`start=${valorInicial}:end=${valorFinal}`); 
                });
                if(valorInicial>0){
                    tagRetorno.markOut = timeToFrame(valorInicial)-1;
                } 
                return resolve(tagRetorno);
            });
        } catch(err){
            return reject(`Erro ao mover arquivo: ${nomeArquivo}`);
        }
   });
}
   function timeToFrame(time){
        return Math.round(time*29.97);
    }

module.exports = { blackFilter };

   
/*

function blackFilter(nomeArquivo) {
    return new Promise((resolve, reject) => {
        try{
            console.time('#lerbuffer');
            
            
            (async () => {
                conteudo =  await lerArquivo(`${paths.PATH_ARQUIVO_BLACK}\\${nomeArquivo}`);
                console.log(conteudo);
                let retorno = conteudo.split('\r\n');
                _.uniq(retorno);
                let linha ='';
                let valorInicial = 0;
                let valorFinal = 0;
                var tagRetorno = {};
                _.forEach(retorno, function(value, key) { 
                    linha=value.split('=');
                    if(_.first(linha)=='TAG:lavfi.black_start')
                        valorInicial = eval(_.takeRight(linha));
                    if(_.first(linha)=='TAG:lavfi.black_end')
                        valorFinal = eval(_.takeRight(linha));
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
                });
                if(valorInicial>0){
                    tagRetorno.markOut = timeToFrame(valorInicial)-1;
                } 
                return resolve(tagRetorno);
              })();
            
           
        } catch(err){
            return reject(`Erro ao mover arquivo: ${nomeArquivo}: ${err}`);
        }
    });
    
    function timeToFrame(time){
        return Math.round(time*29.97);
    }
}
   
*/
/*
async function blackFilter(nomeArquivo) {
    
    return new Promise((resolve, reject) => {
        try{
            fs.readFile(`${paths.PATH_ARQUIVO_BLACK}\\${nomeArquivo}`,'utf8', function(err,data){
                if(err) {
                    console.error("Could not open file: %s", err);
                   // return reject(err);
                }
                let retorno = data.split('\r\n');
                let retorno2 = _.uniq(retorno);
     

                let linha ='';
                let valorInicial = 0;
                let valorFinal = 0;
                var tagRetorno = '';

                _.forEach(retorno2, function(value, key) { 
                    linha=value.split('=');
                    // console.log(linha);
                    if(_.first(linha)=='TAG:lavfi.black_start'){
                        valorInicial = eval(_.takeRight(linha));
                    }
                    if(_.first(linha)=='TAG:lavfi.black_end'){
                        valorFinal = eval(_.takeRight(linha));
                    }
                    if((valorFinal>0) && (valorInicial>0)){
                        if((valorFinal-valorInicial)< 1.1) {
                                console.log(`blackFrame Detectado: ${valorInicial}`);
                                valorInicial = 0;
                                valorFinal = 0;
                        } else {
                            tagRetorno = `start=${valorFinal}`;
                        }
                    valorInicial = 0;
                    valorFinal = 0;
                    }
                    //console.log(`start=${valorInicial}:end=${valorFinal}`); 
                });
                if(valorInicial>0){
                    tagRetorno = `${tagRetorno}:end=${valorInicial}`
                } 
                return resolve(tagRetorno);
            });
        } catch(err){
            return reject(`Erro ao mover arquivo: ${pathArquivoOriginal}`);
        }
   });
}*/
   
//module.exports =  blackFilter ;
