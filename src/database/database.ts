import {models} from 'beast-orm';
import {ChapterUrls} from "./model";

export class CsvExporterDatabase {
    static dbName = "csvExporter";
    static dbVersion = 1;


    constructor() {
    }

    public async createDatabases(): Promise<void> {
        return models.register({
            databaseName: CsvExporterDatabase.dbName,
            version: CsvExporterDatabase.dbVersion,
            type: "indexedDB",
            models: [ChapterUrls],
        });

    }

    public async insertData(episode: number,
                            series: string,
                            embedUrl: string,
                            episodeUrl: string,
                            reader: string): Promise<any> {
        return ChapterUrls.create({
            episode,
            series,
            embedUrl,
            episodeUrl,
            reader,
        });
    }

    public async getData(series: string, episode: number): Promise<any> {
        return ChapterUrls.get({series, episode});
    }
}