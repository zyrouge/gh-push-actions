"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printOptions = exports.parseOptions = void 0;
const core_1 = __importDefault(require("@actions/core"));
const log_1 = require("./log");
const parseOptions = () => ({
    githubToken: core_1.default.getInput("github-token"),
    repository: core_1.default.getInput("repository"),
    branch: core_1.default.getInput("branch"),
    force: core_1.default.getBooleanInput("force"),
    directory: core_1.default.getInput("directory"),
    tempDirPrefix: core_1.default.getInput("temp-dir-prefix"),
    commitMessage: core_1.default.getInput("commit-message"),
    localUsername: core_1.default.getInput("local-username"),
    localEmail: core_1.default.getInput("local-email"),
});
exports.parseOptions = parseOptions;
const printOptions = (options) => {
    const ignoredKeys = ["githubToken"];
    log_1.Logger.info("Options:");
    Object.keys(options).forEach((x) => {
        if (!ignoredKeys.includes(x)) {
            log_1.Logger.info(`   ${x}: ${options[x]}`);
        }
    });
    log_1.Logger.info(" ");
};
exports.printOptions = printOptions;
