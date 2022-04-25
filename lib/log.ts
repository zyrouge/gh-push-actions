export class Logger {
    static isVerbose = false;

    static debug(prefix: string, text: string) {
        console.log(Logger.__getPrefixed(`debug: ${prefix}`, text));
    }

    static warn(prefix: string, text: string) {
        console.warn(Logger.__getPrefixed(`warn: ${prefix}`, text));
    }

    static info(prefix: string, text: string) {
        console.log(Logger.__getPrefixed(`info: ${prefix}`, text));
    }

    static error(prefix: string, text: any) {
        console.error(Logger.__getPrefixed(`error: ${prefix}`, text));
    }

    static verb(prefix: string, text: string) {
        if (Logger.isVerbose) {
            console.log(Logger.__getPrefixed(`verbose: ${prefix}`, text));
        }
    }

    static ln() {
        console.log(" ");
    }

    static __getPrefixed(prefix: string, text: string, seperator = "\n") {
        return text
            .toString() // Just in case
            .split(seperator)
            .map((x) => `${prefix}: ${x}`)
            .join(seperator);
    }
}
