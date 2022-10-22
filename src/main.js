import {CsvExporterDatabase} from "./database";
import {initViewer} from "./init";
import {Reader} from "./utils";

(async () => {
    const database = new CsvExporterDatabase()
    await database.createDatabases();

    initViewer(database);




})();
