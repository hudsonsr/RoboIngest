const { escreverArquivoUtf8, lerArquivoUtf8 } = require('./manipulaArquivo');
const contentFilePath = './content.json'
 
async function save(content){
    const contentString = JSON.stringify(content)
    //return await fs.writeFileSync(contentFilePath,contentString)   
    return await escreverArquivoUtf8(contentFilePath,contentString);  
}

async function load(){
    try{
        const fileBuffer = await lerArquivoUtf8(contentFilePath)
        const contentJson = JSON.parse(fileBuffer)
        return contentJson
    }catch(err){
        console.log(err);
        escreverArquivoUtf8(contentFilePath,'{}');
        return {}
   }
}

module.exports = {
    save,
    load
}