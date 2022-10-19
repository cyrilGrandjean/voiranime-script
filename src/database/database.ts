import {models} from 'beast-orm';
import {ChapterUrls, ChapterUrlsModel} from "./model";

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
            models: [ChapterUrlsModel],
        });

    }

    private createdataId(episode: number, series: string): string {
        return `${series}-${episode}`;
    }

    public async insertData(episode: number,
                            series: string,
                            embedUrl: string,
                            episodeUrl: string,
                            reader: string): Promise<ChapterUrlsModel> {
        return ChapterUrlsModel.create({
            id: this.createdataId(episode, series),
            series,
            episode,
            reader,
            embedUrl,
            episodeUrl,
        });
    }

    public async getData(series: string, episode: number): Promise<ChapterUrlsModel | false> {
        return ChapterUrlsModel.get({id: this.createdataId(episode, series)});
    }

    public async isDataInDB(series: string, episode: number): Promise<boolean> {
        const result = await this.getData(series, episode);
        if (result === false) {
            return false
        } else {
            return true
        }
    }

    public async getAllDataFromSeries(series: string): Promise<ChapterUrls[]> {
        return ChapterUrlsModel.filter({series}).execute();
    }

}