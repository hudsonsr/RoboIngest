const fs = require('fs');
const util = require('util');
const promissify = 
//const Paths = require('../paths');

function extrairArquivo(Caminho){
    
        try{
            Caminho	= Caminho.replace(/\/g, /);
            var Arquivo = Caminho.substring(Caminho.lastIndexOf('\\') + 1);
            Arquivo= Arquivo.substring(0,Arquivo.lastIndexOf('.'));
            return Arquivo;

        }catch(err){
            return err;
        }
        
} 

 function extrairArquivoComExtensao(Caminho){
        try{
            console.log(Caminho);
            Caminho	= Caminho.replace(/\/g, /);
            var Arquivo = Caminho.substring(Caminho.lastIndexOf('\\') + 1);
            //console.log(`Dentro do extrai: ${Arquivo}`);
            return Arquivo;
        }catch(err){
            return err;
        }
        
} 

function extrairTipoArquivo(Caminho){
        try{
            Caminho 	= Caminho.replace(/\/g, /);
            return Caminho.substring(0,Caminho.lastIndexOf('.') + 1);
        }catch(err){
            return err;
        }  
} 

function moverArquivo(pathArquivoOriginal, pathDestino){
    return new Promise((resolve, reject) => {
        let nomeArquivoComExtensao = extrairArquivoComExtensao(pathArquivoOriginal);
       // console.log(`Antes de renomear: ${Paths.PATH_VIDEO_BASE}\\original\\${nomeArquivoComExtensao} - ${pathArquivoOriginal}`)
        try{
            fs.rename(pathArquivoOriginal, `${pathDestino}\\${nomeArquivoComExtensao}` , function (err) {
                if (err){
                    return reject(`Erro ao mover arquivo: ${pathArquivoOriginal}`);
                } else {
                    resolve(`Arquivo ${pathArquivoOriginal} movido com sucesso.`);
                }
            });  
        } catch(err){
            return reject(`Erro ao mover arquivo: ${pathArquivoOriginal}`);
        }
        
    });   
}

async function copiarArquivo(pathArquivoOriginal, pathDestino){
    return new Promise((resolve, reject) => {
        let nomeArquivoComExtensao = extrairArquivoComExtensao(pathArquivoOriginal);
        try{
            fs.copyFile(pathArquivoOriginal, `${pathDestino}\\${nomeArquivoComExtensao}` , function (err) {
                if (err){
                   
                } else {
                    resolve(`Arquivo ${pathArquivoOriginal} copiado com sucesso.`);
                }
            });  
        } catch(err){
            return reject(`Erro ao Copiar arquivo: ${pathArquivoOriginal}`);
        }
        
    });
}

async function escreverArquivoUtf8(contentFilePath,contentString, ){
    return await fs.writeFileSync(contentFilePath,contentString, 'utf-8');
}

async function lerArquivoUtf8(contentFilePath){
    return await fs.readFileSync(contentFilePath,'utf-8'); 
}
 
async function arquivoExiste(contentFilePath){
    return await fs.statSync(contentFilePath);
}
module.exports =  { arquivoExiste, lerArquivoUtf8, escreverArquivoUtf8, moverArquivo, extrairTipoArquivo, extrairArquivoComExtensao, copiarArquivo };
