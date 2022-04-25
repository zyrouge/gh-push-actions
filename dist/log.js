"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static debug(prefix, text) {
        console.log(Logger.__getPrefixed(`debug: ${prefix}`, text));
    }
    static warn(prefix, text) {
        console.warn(Logger.__getPrefixed(`warn: ${prefix}`, text));
    }
    static info(prefix, text) {
        console.log(Logger.__getPrefixed(`info: ${prefix}`, text));
    }
    static error(prefix, text) {
        console.error(Logger.__getPrefixed(`error: ${prefix}`, text));
    }
    static verb(prefix, text) {
        if (Logger.isVerbose) {
            console.log(Logger.__getPrefixed(`verbose: ${prefix}`, text));
        }
    }
    static ln() {
        console.log(" ");
    }
    static __getPrefixed(prefix, text, seperator = "\n") {
        console.log(`kek: ${text}`);
        return text
            .split(seperator)
            .map((x) => `${prefix}: ${x}`)
            .join(seperator);
    }
}
exports.Logger = Logger;
Logger.isVerbose = false;
