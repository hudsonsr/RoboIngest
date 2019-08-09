const fs = require('fs')
const contentFilePath = './content.json'
 
async function save(content){
    const contentString = JSON.stringify(content)
    return await fs.writeFileSync(contentFilePath,contentString)   
}

async function load(){
    try{
        const fileBuffer = await fs.readFileSync(contentFilePath,'utf-8')
        const contentJson = JSON.parse(fileBuffer)
        return contentJson
    }catch(err){
        await fs.writeFileSync(contentFilePath,'{}','utf-8');
        return {}
   }
}

module.exports = {
    save,
    load
}