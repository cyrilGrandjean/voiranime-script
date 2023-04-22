import {ChapterUrls, CsvExporterDatabase} from "../database";
import {Reader, updateDownloadButton, verifiedUrl, videoNotAvailable} from "../utils";

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
                    if (!verifiedUrl(context.embedUrl)) {
                        videoNotAvailable();
                        window.alert('Video not available!');
                        return;
                    }
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
                        // console.info(data);
                        if (data && (data.reader == context.reader)) {
                            await db.updateUrl(context.series, context.episode, context.embedUrl);
                        } else {
                            let confirme = window.confirm('Etes vous sur de vouloir changer de lecteur?');
                            if (confirme) {
                                await db.updateReader(context.series, context.episode, context.reader, context.embedUrl);
                            }
                        }
                    }
                    updateDownloadButton();
                }
            }, 1000, db, context);
        });
    }
}