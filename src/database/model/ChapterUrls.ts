import {models} from "beast-orm";

export class ChapterUrls extends models.Model {
    id = models.AutoField({primaryKey: true});
    series = models.CharField({unique: false});
    episode = models.IntegerField({unique: false});
    reader = models.CharField({unique: false});
    embedUrl = models.CharField({unique: true});
    episodeUrl = models.CharField({unique: true});
}