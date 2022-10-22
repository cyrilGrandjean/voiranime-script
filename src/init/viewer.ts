import {ChapterUrls, CsvExporterDatabase} from "../database";
import {addEventOnCaptChat} from "../event";

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
        setTimeout(addEventOnCaptChat(db, context), 100);
    })

}