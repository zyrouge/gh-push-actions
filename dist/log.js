"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static debug(text) {
        console.log(`debug: ${text}`);
    }
    static warn(text) {
        console.warn(`warn: ${text}`);
    }
    static info(text) {
        console.log(`info: ${text}`);
    }
    static error(text) {
        console.error(`error: ${text}`);
    }
}
exports.Logger = Logger;
