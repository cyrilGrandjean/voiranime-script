import {models} from "beast-orm";

export class ChapterUrlsModel extends models.Model {
    id = models.CharField({primaryKey: true});
    series = models.CharField({unique: false});
    episode = models.IntegerField({unique: false});
    reader = models.CharField({unique: false});
    embedUrl = models.CharField({unique: true});
    episodeUrl = models.CharField({unique: true});
}

export interface ChapterUrls {
    id: string;
    series: string;
    episode: number;
    reader: string;
    embedUrl: string;
    episodeUrl: string;
}