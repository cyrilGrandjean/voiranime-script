import {ReaderManager} from "./reader.manager";

export class Stape extends ReaderManager {

    constructor() {
        super();
    }

    private get iframe(): HTMLIFrameElement {
        return document.querySelector(".chapter-video-frame iframe");
    }

    canGetUrl(): boolean {
        return this.iframe.title === "reCAPTCHA";
    }

    getUrl(): string {
        return this.iframe.src;
    }
}