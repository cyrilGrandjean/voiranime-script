import {CsvExporterDatabase} from "./database";
import {initListEpisode, initViewer} from "./init";

(async () => {
    const database = new CsvExporterDatabase()
    await database.createDatabases();

    initViewer(database);
    await initListEpisode(database);
})();
