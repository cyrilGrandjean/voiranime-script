import {CsvExporterDatabase} from "../database";
import {addButtonDownloadCsv, addIconOnListEpisode, Csv} from "../utils";


export async function initListEpisode(db: CsvExporterDatabase): Promise<void> {
    const chapterList: HTMLElement = document.querySelector(".version-chap");

    if (!chapterList) return;
    const series = window.location.pathname.split("/")[2];
    const data = await db.getAllDataFromSeries(series);
    const csv = new Csv(data);

    addIconOnListEpisode(data);
    addButtonDownloadCsv(csv.download.bind(csv));
}