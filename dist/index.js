"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./tools/options");
const log_1 = require("./tools/log");
const action_1 = require("./action");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = (0, options_1.parseOptions)();
        yield (0, action_1.action)(options);
    }
    catch (err) {
        log_1.logger.error("main", "Something went wrong!");
        console.error(err);
        console.error(err.stack);
        process.exit(err.code || -1);
    }
});
start();
