import { Model, Field } from "@d34d/w-orm";

export class ChapterUrlsModel extends Model {
    @Field({primaryKey: true})
    id: string;

    @Field({unique: false})
    series: string;

    @Field({unique: false})
    episode: number;

    @Field({unique: false})
    reader: string;

    @Field({unique: true})
    embedUrl: string;

    @Field({unique: true})
    episodeUrl: string;
}

export interface ChapterUrls {
    id: string;
    series: string;
    episode: number;
    reader: string;
    embedUrl: string;
    episodeUrl: string;
}