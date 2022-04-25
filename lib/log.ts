export class Logger {
    static isVerbose = false;

    static debug(text: string) {
        console.log(Logger.__getPrefixed("debug", text));
    }

    static warn(text: string) {
        console.warn(Logger.__getPrefixed("warn", text));
    }

    static info(text: string) {
        console.log(Logger.__getPrefixed("info", text));
    }

    static error(text: any) {
        console.error(Logger.__getPrefixed("error", text));
    }

    static verb(text: string) {
        if (Logger.isVerbose) {
            console.log(Logger.__getPrefixed("verbose", text));
        }
    }

    static __getPrefixed(prefix: string, text: string, seperator = "\n") {
        return text
            .split(seperator)
            .map((x) => `${prefix}: ${x}`)
            .join(seperator);
    }
}
