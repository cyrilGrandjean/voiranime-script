import {ChapterUrls, CsvExporterDatabase} from "../database";
import {addEventOnCaptChat} from "../event";
import {copyToClipboard, createDownloadButton, updateDownloadButton} from "../utils";

export function initViewer(db: CsvExporterDatabase): void {
    const lecteurPicker: HTMLInputElement =
        document.querySelector(".host-select");
    if (!lecteurPicker) return;

    const context: Partial<ChapterUrls> = {}

    const chapterPicker: HTMLSelectElement = document.querySelector(
        ".single-chapter-select"
    );
    context.episodeUrl = window.location.href;
    context.series = window.location.pathname.split('/')[2];
    context.episode = Number(chapterPicker.options[chapterPicker.selectedIndex].innerHTML);
    context.reader = lecteurPicker.value;

    addEventOnCaptChat(db, context)();

    lecteurPicker.addEventListener("change", (e: InputEvent) => {
        context.reader = (e.target as HTMLInputElement).value;
        setTimeout((db: CsvExporterDatabase, context: Partial<ChapterUrls>) => {
            addEventOnCaptChat(db, context)();
            updateDownloadButton();
        }, 500, db, context);
    })

    createDownloadButton(copyToClipboard(db, context));

}