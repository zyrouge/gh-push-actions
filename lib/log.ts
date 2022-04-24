export class Logger {
    static debug(text: string) {
        console.log(`debug: ${text}`);
    }

    static warn(text: string) {
        console.warn(`warn: ${text}`);
    }

    static info(text: string) {
        console.log(`info: ${text}`);
    }

    static error(text: any) {
        console.error(`error: ${text}`);
    }
}
