export abstract class ReaderManager {
    constructor() {
    }

    abstract canGetUrl(): boolean;

    abstract getUrl(): string;

}