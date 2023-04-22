import { init } from "@d34d/w-orm";
import {ChapterUrls, ChapterUrlsModel} from "./model";

export class CsvExporterDatabase {
    static dbName = "csvExporter";
    static dbVersion = 1;


    constructor() {
    }

    public async createDatabases(): Promise<void> {
        await init(CsvExporterDatabase.dbName, CsvExporterDatabase.dbVersion);
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

    public async getData(series: string, episode: number): Promise<ChapterUrls | null> {
        return ChapterUrlsModel.get(this.createdataId(episode, series));
    }

    public async isDataInDB(series: string, episode: number): Promise<boolean> {
        const result = await this.getData(series, episode);
        return !!result;
    }

    public async getAllDataFromSeries(series: string): Promise<ChapterUrls[]> {
        const data: ChapterUrls[] = await ChapterUrlsModel.filter({series}).orderBy("episode").all();

        return data;
    }

    public async updateUrl(series: string, episode: number, url: string): Promise<void> {
        const id = this.createdataId(episode, series);
        await ChapterUrlsModel.filter({id: id}).update({embedUrl: url});
    }

    public async updateReader(series: string, episode: number, reader: string, url: string): Promise<void> {
        const id = this.createdataId(episode, series);
        await ChapterUrlsModel.filter({id: id}).update({embedUrl: url, reader: reader});
    }

}