export class Reader {
    iframe: HTMLIFrameElement;

    constructor() {
        this.getIframe();
    }

    private getIframe(): void {
        this.iframe = document.querySelector(".chapter-video-frame iframe");
    }

    public canGetUrl(): boolean {
        return this.iframe.title !== 'reCAPTCHA';
    }

    public getUrl(): string {
        return this.iframe.src;
    }
}