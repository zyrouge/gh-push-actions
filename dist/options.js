"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printOptions = exports.parseOptions = void 0;
const core_1 = require("@actions/core");
const log_1 = require("./log");
const parseOptions = () => ({
    githubToken: (0, core_1.getInput)("github-token"),
    repository: (0, core_1.getInput)("repository"),
    branch: (0, core_1.getInput)("branch"),
    force: (0, core_1.getBooleanInput)("force"),
    directory: (0, core_1.getInput)("directory"),
    tempDirPrefix: (0, core_1.getInput)("temp-dir-prefix"),
    commitMessage: (0, core_1.getInput)("commit-message"),
    localUsername: (0, core_1.getInput)("local-username"),
    localEmail: (0, core_1.getInput)("local-email"),
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
