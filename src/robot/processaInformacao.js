const state = require('./State');
const { arquivoExiste } = require('./manipulaArquivo');
const path = require('../paths');
const fs =require('fs');
async function processaInformacao() {
  try {
    var content = {};
    content = await state.load();
    var cont = 0;
    if (!content.materiais) content.materiais = [];
    var materiais= content.materiais;
    //console.log(materiais.length);
    for([idx,value] of materiais.entries()) {
     // console.log(JSON.stringify(value));
      let video = `${path.PATH_VIDEO_BASE}/${value.MATERIAL}_${value.TITULO}.mxf`;
      //console.log(`Arquivo ${video}`);
      if (fs.existsSync(video)) {
        console.log(`Arquivo ${video}`);
        console.log(value.MATERIAL);
      };//.catch((err)=>{
        //console.log("não existe");
      //});
      //console.log("foi");
     // console.log(existe);
      /*if (existe === true) {
        console.log(`${cont}`);
      } else {
        console.log(`Arquivo ${video} não existe.`);
      }*/
      cont += 1;
    }
  } catch (err) {
    //console.log(err);
  }

}

module.exports = processaInformacao   
