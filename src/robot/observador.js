const fs = require("fs");
const filePath = "C:\\ESD";

var file = fs.readdirSync(filePath);

console.log(`Este é o conteudo inicial da pasta: \n ${file}`);

fs.watch(filePath, "utf-8", (event, trigger) => {
    console.log(`Ele foi ${event} as ${trigger}`);  
})
