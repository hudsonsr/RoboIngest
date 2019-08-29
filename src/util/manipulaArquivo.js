const fs = require('fs');
const _ = require('lodash');

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
                     reject(`Erro ao mover arquivo: ${pathArquivoOriginal} - ${err}`);
                } else {
                    resolve(`Arquivo ${pathArquivoOriginal} movido com sucesso.`);
                }
            });  
        } catch(err){
             reject(`Erro ao mover arquivo: ${pathArquivoOriginal}`);
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

async function escreverArquivo(contentFilePath,contentString, encoding){
    return await fs.writeFileSync(contentFilePath,contentString, encoding);
}

async function lerArquivo(contentFilePath, encoding){
    return await fs.readFileSync(contentFilePath, encoding); 
}

async function arquivoExiste(contentFilePath){
    return await fs.existsSync(contentFilePath);
}

function existeItemNoArray( meuArray, condicao){
    result= _.filter(meuArray, condicao) 
    
    if (result.length == 0) {
        return false;
    } 
    return true;
}

module.exports =  { existeItemNoArray, arquivoExiste, lerArquivo, escreverArquivo, moverArquivo, extrairTipoArquivo, extrairArquivoComExtensao, extrairArquivo, copiarArquivo };
