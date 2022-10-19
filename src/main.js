import {Context} from "./models/context.ts";
import {CsvExporterDatabase} from "./database";
import {Csv} from "./utils";

(async () => {
    console.info("Start script");
    const context = new Context();
    console.info("Create context");
    const database = new CsvExporterDatabase();
    console.info("Initialized database");
    await database.createDatabases();
    console.info("Database Up");
    if (!await database.isDataInDB('seriees', 1)) {
        await database.insertData(1, 'seriees', 'embed', 'url', 'readdder');
        await database.insertData(2, 'seriees', 'embe', 'urld', 'readdder');
        await database.insertData(3, 'seriees', 'emb', 'urled', 'readdder');
        await database.insertData(4, 'seriees', 'em', 'urlbed', 'readdder');
        console.info("Insert Data");
    }
    const data = await database.getData('seriees', 1);
    console.info(data);
    const data2 = await database.getAllDataFromSeries('seriees');
    console.info(data2);
})();
