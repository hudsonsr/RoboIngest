const importExcelOpecToJson = require('./src/robot/importExcelOpecToJson');
const state = require('./src/robot/state');

 async function Start(){
    await importExcelOpecToJson('C:\\Users\\hudsons\\Desktop\\02-08-2019 A.xls');
    //const content = await state.load();
}

 Start();