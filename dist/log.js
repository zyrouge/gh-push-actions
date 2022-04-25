"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static debug(text) {
        console.log(Logger.__getPrefixed("debug", text));
    }
    static warn(text) {
        console.warn(Logger.__getPrefixed("warn", text));
    }
    static info(text) {
        console.log(Logger.__getPrefixed("info", text));
    }
    static error(text) {
        console.error(Logger.__getPrefixed("error", text));
    }
    static verb(text) {
        if (Logger.isVerbose) {
            console.log(Logger.__getPrefixed("verbose", text));
        }
    }
    static __getPrefixed(prefix, text, seperator = "\n") {
        return text
            .split(seperator)
            .map((x) => `${prefix}: ${x}`)
            .join(seperator);
    }
}
exports.Logger = Logger;
Logger.isVerbose = false;
