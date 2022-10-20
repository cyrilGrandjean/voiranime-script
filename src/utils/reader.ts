export class Reader {

    constructor() {
    }

    private get iframe(): HTMLIFrameElement {
        return document.querySelector(".chapter-video-frame iframe");
    }

    public canGetUrl(): boolean {
        return this.iframe.title === 'reCAPTCHA';
    }

    public getUrl(): string {
        return this.iframe.src;
    }
}