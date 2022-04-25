export type ILoggerMethodFn = (prefix: string, text: string) => void;

export interface ILogger {
    debug: ILoggerMethodFn;
    warn: ILoggerMethodFn;
    info: ILoggerMethodFn;
    error: ILoggerMethodFn;
    verb: ILoggerMethodFn;
}

export type ILoggerMethod = keyof ILogger;

export class Logger implements ILogger {
    isVerbose = false;

    debug(prefix: string, text: string) {
        console.log(this.__getPrefixed(`debug: ${prefix}`, text));
    }

    warn(prefix: string, text: string) {
        console.warn(this.__getPrefixed(`warn: ${prefix}`, text));
    }

    info(prefix: string, text: string) {
        console.log(this.__getPrefixed(`info: ${prefix}`, text));
    }

    error(prefix: string, text: any) {
        console.error(this.__getPrefixed(`error: ${prefix}`, text));
    }

    verb(prefix: string, text: string) {
        if (this.isVerbose) {
            console.log(this.__getPrefixed(`verbose: ${prefix}`, text));
        }
    }

    ln() {
        console.log(" ");
    }

    __getPrefixed(prefix: string, text: string, seperator = "\n") {
        return text
            .toString() // Just in case
            .split(seperator)
            .map((x) => `${prefix}: ${x}`)
            .join(seperator);
    }
}

export const logger = new Logger();
