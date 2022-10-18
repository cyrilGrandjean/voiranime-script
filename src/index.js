import {Context} from "./context.ts";
import {CsvExporterDatabase} from "./database";

(async () => {
    console.info("Start script");
    const context = new Context();
    console.info("Create context");
    const database = new CsvExporterDatabase();
    console.info("Initialized database");
    await database.createDatabases();
    console.info("Database Up");
})();
