interface Chapter {
  serie: string;
  chapter: string;
  url: string;
  fullUrl: string;
}

export class Context {
  seriesId: string;
  chapterNumber: string;
  reader: string;
  url: string;
  fullUrl: string;
  chapters: Chapter[];
  inDB: boolean;

  constructor() {
    this.chapters = [];
    this.inDB = false;
  }
}
