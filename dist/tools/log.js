"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    constructor() {
        this.isVerbose = false;
    }
    debug(prefix, text) {
        console.log(this.__getPrefixed(`debug: ${prefix}`, text));
    }
    warn(prefix, text) {
        console.warn(this.__getPrefixed(`warn: ${prefix}`, text));
    }
    info(prefix, text) {
        console.log(this.__getPrefixed(`info: ${prefix}`, text));
    }
    error(prefix, text) {
        console.error(this.__getPrefixed(`error: ${prefix}`, text));
    }
    verb(prefix, text) {
        if (this.isVerbose) {
            console.log(this.__getPrefixed(`verbose: ${prefix}`, text));
        }
    }
    ln() {
        console.log(" ");
    }
    __getPrefixed(prefix, text, seperator = "\n") {
        return text
            .toString() // Just in case
            .split(seperator)
            .map((x) => `${prefix}: ${x}`)
            .join(seperator);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
