const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { extrairArquivo } = require('../util/manipulaArquivo');
const paths = require('../paths');

 async function detectarBlackFrame(arquivo){
    console.log(`começou DetectarBlackFrame. ${arquivo}`);
    try{
        await detectaBlackFrame(`${arquivo}`);
        console.log(`Terminou DetectarBlackFrame. ${arquivo}`);
    } catch(err){
        console.log(`Erro ao detectar Black: ${arquivo}`);
    }
    
    async function detectaBlackFrame(video) {
      //console.log(`ffprobe -f lavfi -i "movie=\\'${video.replace(/\\/g,'\\\\')}\\',blackdetect[out0]" -show_entries tags=lavfi.black_start,lavfi.black_end -of default=nw=1 -v quiet > "${paths.PATH_ARQUIVO_BLACKFILTER}\\${extrairArquivo(video)}.txt"`);  
      const { stdout, stderr } = await exec(`ffprobe -f lavfi -i "movie=\\'${video.replace(/\\/g,'\\\\')}\\',blackdetect[out0]" -show_entries tags=lavfi.black_start,lavfi.black_end -of default=nw=1 -v quiet > "${paths.PATH_ARQUIVO_BLACKFILTER}\\${extrairArquivo(video)}.txt"`);
      console.log(stdout);
    }
}
module.exports = detectarBlackFrame;
