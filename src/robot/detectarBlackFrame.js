const util = require('util');
const exec = util.promisify(require('child_process').exec);
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
      const { stdout, stderr } = await exec(`ffprobe -f lavfi -i "movie=${paths.PATH_BASE_BACK}${video},blackdetect[out0]" -show_entries tags=lavfi.black_start,lavfi.black_end -of default=nw=1 -v quiet > "${paths.PATH_ARQUIVO_BLACK}\\${video}.txt"`);
      console.log(stdout);
    }
}
module.exports = detectarBlackFrame;
