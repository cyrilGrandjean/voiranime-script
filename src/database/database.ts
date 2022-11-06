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
                            reader: string): Promise<ChapterUrls> {
        return ChapterUrlsModel.create({
            id: this.createdataId(episode, series),
            series,
            episode,
            reader,
            embedUrl,
            episodeUrl,
        });
    }

    public async getData(series: string, episode: number): Promise<ChapterUrls | false> {
        return ChapterUrlsModel.get({id: this.createdataId(episode, series)});
    }

    public async isDataInDB(series: string, episode: number): Promise<boolean> {
        const result = await this.getData(series, episode);
        return result !== false;
    }

    public async getAllDataFromSeries(series: string): Promise<ChapterUrls[]> {
        const data: ChapterUrls[] = await ChapterUrlsModel.filter({series}).execute();
        data.sort(
            (a, b) => {
                if (a.episode < b.episode) {
                    return -1;
                } else if (a.episode > b.episode) {
                    return 1
                } else {
                    return 0;
                }
            }
        )
        return data;
    }

    public async updateUrl(series: string, episode: number, url: string): Promise<ChapterUrls> {
        const id = this.createdataId(episode, series);
        return ChapterUrlsModel.filter({id: id}).update({embedUrl: url});
    }

    public async updateReader(series: string, episode: number, reader: string, url: string): Promise<ChapterUrls> {
        const id = this.createdataId(episode, series);
        return ChapterUrlsModel.filter({id: id}).update({embedUrl: url, reader: reader});
    }

}