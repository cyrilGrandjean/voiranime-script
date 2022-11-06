import {ChapterUrls} from "../database";

export class Csv {
    private dataBrut: ChapterUrls[];
    private filename: string;

    constructor(data: ChapterUrls[]) {
        this.dataBrut = data;
        this.filename = data[0].series;
    }

    private formatData(): { episode: number, url: string }[] {
        return this.dataBrut.map((data) => {
            return {
                episode: data.episode,
                url: data.embedUrl,
            };
        });
    }

    private createCsvRow(): string[] {
        const result: string[] = [];
        const formatedData = this.formatData();
        const keys = Object.keys(formatedData[0])
        const firstRow = keys.join(';');
        result.push(firstRow);
        result.push(...formatedData.map((data) => Object.values(data).join(';')));
        return result;
    }

    private createCsvBlob(): Blob {
        return new Blob([this.createCsvRow().join("\n")], {type: "text/csv"});
    }

    public download(): void {
        const url = window.URL.createObjectURL(this.createCsvBlob());
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `${this.filename}.csv`);
        a.click();
    }

}