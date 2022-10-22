import {ChapterUrls, CsvExporterDatabase} from "../database";
import {Reader} from "../utils";

export function addEventOnCaptChat(db: CsvExporterDatabase, context: Partial<ChapterUrls>) {
    return () => {
        const buttonCaptcha: HTMLButtonElement = document.querySelector(
            "#chapter-video-captcha-validator button[type=submit]"
        );

        if (!buttonCaptcha) return;

        buttonCaptcha.addEventListener("click", async () => {
            let intervalID = null;
            const clrInterval = () => {
                clearInterval(intervalID);
            }
            intervalID = setInterval(async (db: CsvExporterDatabase, context: Partial<ChapterUrls>) => {
                const reader = new Reader();
                if (reader.canGetUrl()) {
                    clrInterval();
                    context.embedUrl = reader.getUrl();
                    if (!await db.isDataInDB(context.series, context.episode)) {
                        await db.insertData(
                            context.episode,
                            context.series,
                            context.embedUrl,
                            context.episodeUrl,
                            context.reader
                        );
                    } else {
                        const data = await db.getData(context.series, context.episode);
                        if (data != false && (data.reader == context.reader)) {
                            await db.updateUrl(context.series, context.episode, context.embedUrl);
                        } else {
                            if (window.confirm('Etes vous sur de vouloir changer de lecteur?')) {
                                await db.updateReader(context.series, context.episode, context.embedUrl, context.reader);
                            }
                        }
                    }
                }
            }, 1000, db, context);
        });
    }
}