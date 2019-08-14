const { escreverArquivo, lerArquivo } = require('./manipulaArquivo');
const contentFilePath = './content.json';
 
async function save(content){
    const contentString = JSON.stringify(content)
    //return await fs.writeFileSync(contentFilePath,contentString)   
    return await escreverArquivo(contentFilePath,contentString,'utf8');  
}

async function load(){
    try{
        const fileBuffer = await lerArquivo(contentFilePath,'utf8')
        const contentJson = JSON.parse(fileBuffer)
        return contentJson
    }catch(err){
        //console.log(err);
        await escreverArquivo(contentFilePath,'{}','utf8');
        return {}
   }
}

module.exports = {
    save,
    load
}