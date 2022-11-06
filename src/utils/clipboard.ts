import {ChapterUrls, CsvExporterDatabase} from "../database";
import {updateDownloadButtonClipboard} from "./dom";

export function copyToClipboard(db: CsvExporterDatabase, context: Partial<ChapterUrls>): () => void {
    return async () => {
        const data = await db.getData(context.series, context.episode);

        if (data != false && (data.reader == context.reader)) {
            navigator.clipboard.writeText(data.embedUrl);
            updateDownloadButtonClipboard();
        }
    }
}