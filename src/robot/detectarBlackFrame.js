const util = require('util');
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash');
const state = require('../util/State');
const { existeItemNoArray, extrairArquivo } = require('../util/manipulaArquivo');
const paths = require('../paths');

 async function detectarBlackFrame(){
    console.log(`começou DetectarBlackFrame.`);
    try {
    
        var content = {};
        content = await state.load();
        if (!content.materiais) content.materiais = [];
        let materiais =_.filter(content.materiais,  { 'ARQUIVO_EXISTE': true, 'ARQUIVO_PROCESSADO': false }) 
        
        for([idx,value] of materiais.entries()) {
          //console.log(`Indice no Array: ${idx}`);
          //console.log(value.OBSERVACAO);
          var valores = value;
          var { MATERIAL, TITULO, OBSERVACAO } = valores;
          var nomeArquivoVideo = `${MATERIAL}_${TITULO}`;
          var arquivoVideo = `${nomeArquivoVideo}.mxf`;
          if(!existeItemNoArray(content.materiais,  { 'MATERIAL': MATERIAL, 'ARQUIVO_EXISTE': true, 'ARQUIVO_PROCESSADO': false })) continue;
      
          try{
            let novo_Item = { ...value, "ARQUIVO_PROCESSADO": true }
            //console.log(novo_Item);
            _.remove(content.materiais,(material) => {
                return material.MATERIAL == value.MATERIAL;
            });
            content.materiais.push(novo_Item);
            state.save(content);
            await detectaBlackFrame(`${OBSERVACAO}\\${arquivoVideo}`);
            _.remove(content.materiais,(material) => {
                return material.MATERIAL == value.MATERIAL;
            });
            content.materiais.push(novo_Item);
            state.save(content);
            } catch(err2){
              let novo_Item = { ...value, "ARQUIVO_PROCESSADO": false }
              //console.log(novo_Item);
              _.remove(content.materiais,(material) => {
                  return material.MATERIAL == value.MATERIAL;
              });
              content.materiais.push(novo_Item);
              state.save(content);
              console.log(`${nomeArquivoVideo}: ${err2}`);
              sleep(10000);
            }
          };
       
        console.log('Finalizado');
        return true;
      } catch (err) {
        console.log(err);
        console.log('Finalizado');
      }
   
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    async function detectaBlackFrame(video) {
      //console.log(`ffprobe -f lavfi -i "movie=\\'${video.replace(/\\/g,'\\\\')}\\',blackdetect[out0]" -show_entries tags=lavfi.black_start,lavfi.black_end -of default=nw=1 -v quiet > "${paths.PATH_ARQUIVO_BLACKFILTER}\\${extrairArquivo(video)}.txt"`);  
      console.log('antes fprobe');
      const { stdout, stderr } = await exec(`ffprobe -f lavfi -i "movie=\\'${video.replace(/\\/g,'\\\\')}\\',blackdetect[out0]" -show_entries tags=lavfi.black_start,lavfi.black_end -of default=nw=1 -v quiet > "${paths.PATH_ARQUIVO_BLACKFILTER}\\${extrairArquivo(video)}.txt"`);
      console.log('depois fprobe');
      //console.dir(stdout );
      //console.dir(stderr );
    }
}
module.exports = detectarBlackFrame;
